use ice9_core::Particle;
use rocket::serde::{json::Json, Deserialize, Serialize};
use rocket::{post, routes, Build, Rocket};
use anyhow::Result;
use ice_nine_plugin_model_openai::{OpenAIParticle};
use ice9_core::SubstanceLinks;

#[derive(Deserialize)]
struct QueryRequest {
    prompt: String,
}

#[derive(Serialize)]
struct QueryResponse {
    response: String,
}

#[post("/query", format = "json", data = "<query_request>")]
async fn query(query_request: Json<QueryRequest>) -> Result<Json<QueryResponse>> {
    let substance: ice9_core::SubstanceLinks = SubstanceLinks::default();

    // Call the construct function with the required argument
    let substance = SubstanceLinks::default();
    let client = OpenAIParticle::construct(substance);
    let mut client = OpenAIParticle::construct(substance);
    client.try_into().unwrap();
    let response = client.query(&query_request.prompt).await?;
    Ok(Json(QueryResponse { response }))
}

pub fn rocket() -> Rocket<Build> {
    rocket::build().mount("/", routes![query])
}