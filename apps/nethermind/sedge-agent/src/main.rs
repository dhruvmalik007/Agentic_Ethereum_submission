use anyhow::Result;
use crb_system::Main;
use dotenv::dotenv;
use ice9_core::Substance;
use ice_nine_plugin_app_stdio::StdioApp;
use ice_nine_plugin_control_chat::ChatParticle;
use ice_nine_plugin_model_openai::OpenAIParticle;
use std::env;
use ui9_mesh::Mesh;

mod api;

#[tokio::main]
async fn main() -> Result<()> {
    // Load environment variables from .env file
    dotenv().ok();

    // Print all environment variables
    for (key, value) in env::vars() {
        println!("{}: {}", key, value);
    }

    // Set the OpenAI API key directly in the code (if needed)
    // env::set_var("OPENAI_API_KEY", "your_valid_api_key_here");

    env_logger::try_init()?;
    Mesh::activate().await?;
    let substance = Substance::arise();
    substance.add_particle::<OpenAIParticle>()?;
    substance.add_particle::<ChatParticle>()?;
    substance.add_particle::<StdioApp>()?;

    // Add any additional particles if needed
    // substance.add_particle::<AnotherParticle>()?;

    substance.into_address().join_or_signal().await?;
    Mesh::deactivate().await?;
    // Unblocking stdin

    // Start the Rocket server
    api::rocket().launch().await?;

    Ok(())
}