/**
 * About this script:
 * this script allows the user to:
 * scrape the details corresponding to the given defi protocol data information that user wants to create the eliza configuration, including 
 *  - docs of the corresponding protocol
 *  - github links of the protocol smart contracts
 *  - defines the required template file that is to be generated 
 *  - generates the relevant information of the corresponding protocol information
 *  - creates the eliza character file given the information.
 *  
 */
import { chromium, Browser, Page } from 'playwright';
import { TextSplitter, RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from '@langchain/openai';
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { WeaviateStore } from "@langchain/weaviate";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { ElizaCharacterFile } from './types';
import weaviate from "weaviate-ts-client";
import zod from "zod";

interface FrameworkData {
  [key: string]: {
    githubLink: string;
    blockchainsSupported: string[];
  };
}

class CustomAgentCreation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private weaviateClient: any;

  constructor() {
    this.weaviateClient = (weaviate as any).client({
      scheme: process.env.WEAVIATE_SCHEME ?? "http",
      host: process.env.WEAVIATE_HOST ?? "localhost",
      // If necessary
      // apiKey: new ApiKey(process.env.WEAVIATE_API_KEY ?? "default"),
    });
  }

  // sets the Playwright client
  async initPlaywrightClient() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
  }

  async scrapeFrameworkDetails(url: string): Promise<FrameworkData> {
    if (!this.page) throw new Error("Page not initialized");
    await this.page.goto(url);

    const frameworks = await this.page.evaluate(() => {
      const data: FrameworkData = {};
      const frameworkElements = document.querySelectorAll('.framework-class'); // Replace with the actual selector

      frameworkElements.forEach((element) => {
        const name = element.querySelector('.framework-name-class')?.textContent?.trim(); // Replace with the actual selector
        const githubLink = element.querySelector('a[href*="github.com"]')?.getAttribute('href') || '';
        const blockchainsSupported = element.querySelector('.blockchains-class')?.textContent?.split(',').map(chain => chain.trim()) || []; // Replace with the actual selector

        if (name) {
          data[name] = {
            githubLink,
            blockchainsSupported,
          };
        }
      });

      return data;
    });

    return frameworks;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async execute(url: string) {
    try {
      await this.initPlaywrightClient();
      const frameworkData = await this.scrapeFrameworkDetails(url);
      console.log(JSON.stringify(frameworkData, null, 2));
    } catch (error: Error | any) {
      console.error(error.message);
    } finally {
      await this.close();
    }
  }

  async loadMarkdownFilesFromRepo(githubRepoUrl: string, subfolder: string): Promise<string[]> {
    try {
      const loader = new GithubRepoLoader(githubRepoUrl, {
        recursive: true,
        branch: "main",
        ignoreFiles: ["!**/*.md"],
        ignorePaths: [`!${subfolder}`],
      });

      const documents = await loader.load();

      console.log(`Loaded ${documents.length} markdown files.`);

      // Extract and return the source paths of the loaded documents
      const filePaths = documents.map(doc => doc.metadata.source);
      console.log("List of file paths:");
      filePaths.forEach(path => console.log(path));

      return filePaths;
    } catch (error) {
      console.error("Failed to load documents:", error);
      return [];
    }
  }

  async storeMarkdownFilesInVectorDB(githubRepoUrl: string, subfolder: string) {
    try {
      // Load markdown file paths from GitHub repo
      const markdownPaths = await this.loadMarkdownFilesFromRepo(githubRepoUrl, subfolder);

      // Load unstructured files
      const unstructuredDocuments = [];
      for (const path of markdownPaths) {
        const loader = new UnstructuredLoader(path, {
          apiKey: process.env.UNSTRUCTURED_API_KEY,
          apiUrl: process.env.UNSTRUCTURED_API_URL,
        });
        const data = await loader.load();
        unstructuredDocuments.push(...data);
      }
      

      // Split text into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocuments = await textSplitter.splitDocuments(unstructuredDocuments);

      // Embed documents
      const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
      });

      // Store in Weaviate
      const vectorStore = new WeaviateStore(embeddings, {
        client: this.weaviateClient,
        indexName: "Langchainjs_test",
        textKey: "text",
        metadataKeys: ["source"],
        
      });
      await vectorStore.addDocuments(splitDocuments);

      console.log('Documents successfully stored in vector database.');
    } catch (error) {
      console.error('Error storing documents in vector database:', error);
    }
  }
}

// Example usage
const customAgentCreation = new CustomAgentCreation();
customAgentCreation.storeMarkdownFilesInVectorDB('https://github.com/electric-capital/crypto-ecosystems', 'data/ecosystems').catch(console.error);