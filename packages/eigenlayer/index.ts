/**
 * 
 */
import {GithubRepoLoader} from "@langchain/community/document_loaders/web/github";
import {AgentArgs} from "langchain/agents"
import {Document} from "langchain/document"
import { Octokit } from "octokit";
import {OpenAI, OpenAIEmbeddings} from "@langchain/openai"
import { ChatModelProvider } from "langchain/chat_models/universal";
import {configDotenv} from "dotenv";
import { exec } from "child_process";

//import  { WeaviateClient as WeaviateClientFromWeaviate } from "weaviate-client";
import weaviate, { WeaviateClient as WeaviateClientFromTsClient, ApiKey }  from "weaviate-ts-client";
import {WeaviateStore} from "@langchain/weaviate";
configDotenv();

class EigenLayer {
    urlEigenMiddleLayer: string = "https://github.com/Layr-Labs/eigenlayer-middleware";
    forgeRepo: string = "https://github.com/foundry-rs/forge-std"
    urlGithubOperator: string = "";
    repoLoader: GithubRepoLoader;
    octokit: Octokit;
    openai: OpenAI;
    constructor(githubOperatorRepo: string) {
        this.repoLoader = new GithubRepoLoader(this.urlEigenMiddleLayer, {
            accessToken: process.env.GITHUB_ACCESS_TOKEN,
            branch: "main", // todo: insure that the uptodate branch is main / or make it configurable
            recursive: true, // in order to include other dependent modules (even if in most case its not required). 
        });
        this.urlGithubOperator = githubOperatorRepo;
        this.octokit = new Octokit();
        this.openai = new OpenAI(
            {
                configuration: {
                    apiKey: process.env.OPENAI_API_KEY,
                    maxRetries: 3,

                }
            }
        );
    }

    /**
     * analyzes the github code repository of the operator code by parsing the codebase and then:
     * - analyzes the readme and other documents for creating understanding of the codebase
     * - it chunks and stores the code as embeddings 
     * - then user can do the query in order to define the tasks that are to be implemented in order to execute the codebase
     * @return the link of the vectorDB storage of the codeRepo. 
     */
    async vectoriseOperatorCode() {
        // first fetches all of the readme file paths from the github repo of the oeprator
        
        const docs: Document[] = await this.repoLoader.load();


        // find all of those docs that are havingmarkdown extension
        const markdownDocs = docs.filter(doc => doc.pageContent.search("*.md"));

        // // then vectorize the markdown docs
        // const weaviateObj = await weaviate.connectToWeaviateCloud(
        //     process.env.WEAVIATE_URL!, {
        //         authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY!),
        //         headers: {
        //             'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',  // Replace with your inference API key
        //         }
        //     }
        // ) as unknown as WeaviateClientFromTsClient; 

        const weaviateObj =  new (weaviate as any).client({
            scheme: process.env.WEAVIATE_SCHEME ?? "http",
            host: process.env.WEAVIATE_HOST ?? "localhost",
            // If necessary
             apiKey: new ApiKey(process.env.WEAVIATE_API_KEY ?? "default"),
          });
        const embeddings = new OpenAIEmbeddings(this.openai);

        // also getting the name of the repo from the github url middlename second last part

        const repoName = this.urlGithubOperator.split("/").slice(-2)[0];

        // connecting with adapter of the langchain with that of the weaviate
        const weviateStorage = new WeaviateStore(embeddings, {
            client: weaviateObj ,
            indexName:repoName,
            textKey: "text",
            metadataKeys: ["metadata"],
        });

        // now start adding all of the markdown docs to the weaviate storage
        await weviateStorage.addDocuments(markdownDocs);
    }


    async cloneRepoMiddleware() {
        exec(`git submodule add ${this.urlEigenMiddleLayer} eigenlayer/middlelayer`, (error: any, stdout: string, stderr: string) => {
            if (error) {
                console.error(`Error cloning repo: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error: ${stderr}`);
                return;
            }
            console.log(`Repo cloned: ${stdout}`);
        });
    }

    setOperatorRepoUrl(url: string) {
        this.urlGithubOperator = url;
    }

    async explainOperatorCode() {
        if (!this.urlGithubOperator) {
            throw new Error("Operator repo URL is not set.");
        }

        const repoContent = await this.repoLoader.load();
        const operatorCode = repoContent.join("\n");

        const response = await this.openai.generate(
             ["Explain the following code: ${operatorCode}"],
             
        );

        return response.generations;
    }
}