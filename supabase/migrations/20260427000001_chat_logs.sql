-- Chat session logging with visitor identity and feedback tracking
-- Safe to re-run: drops and recreates

drop table if exists chat_logs;

create table chat_logs (
  id            bigserial primary key,
  session_id    uuid not null,
  visitor_id    uuid not null,
  question      text not null,
  response      text not null,
  context_chunks text,
  feedback      text check (feedback in ('good', 'bad')),
  correction_note text,
  asked_at      timestamptz not null default now()
);

-- Only service_role can write/read (this is internal data, not public)
grant all on chat_logs to postgres, service_role;
grant usage, select on sequence chat_logs_id_seq to postgres, service_role;

-- Index for browsing by visitor or session
create index chat_logs_visitor_idx on chat_logs (visitor_id, asked_at desc);
create index chat_logs_session_idx on chat_logs (session_id, asked_at);
