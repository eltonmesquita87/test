/* tslint:disable */
interface Config {
  guidewire: Guidewire;
  sql_folder: undefined;
  database_url: undefined;
  slack: Slack;
  eventsGL: EventsGL;
}
interface EventsGL {
  user_name: undefined;
  password: undefined;
  default_database: undefined;
  host_name: undefined;
  notification: undefined;
}
interface Slack {
  url: undefined;
  channel: undefined;
  channel_bas: undefined;
  channel_error: undefined;
  channel_gl: undefined;
}
interface Guidewire {
  default_env: undefined;
  envs: undefined[];
}
