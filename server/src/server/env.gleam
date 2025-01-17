import gleam/result
import glenvy/dotenv
import glenvy/env

pub type Env {
  Env(
    db_host: String,
    db_password: String,
    db_port: Int,
    db_user: String,
    db_name: String,
  )
}

pub fn get_env() {
  let _ = dotenv.load()

  let env = {
    use db_host <- result.try(env.get_string("DB_HOST"))
    use db_password <- result.try(env.get_string("DB_PASSWORD"))
    use db_port <- result.try(env.get_int("DB_PORT"))
    use db_user <- result.try(env.get_string("DB_USER"))
    use db_name <- result.try(env.get_string("DB_NAME"))
    Ok(Env(db_host, db_password, db_port, db_user, db_name))
  }

  case env {
    Ok(env) -> Ok(env)
    Error(err) ->
      case err {
        env.FailedToParse(env) -> "Failed to parse env: " <> env
        env.NotFound(env) -> "Didn't find env: " <> env
      }
      |> Error
  }
}
