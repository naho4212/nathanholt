-- session_id and visitor_id are best-effort — don't block logging if missing
alter table chat_logs alter column session_id drop not null;
alter table chat_logs alter column visitor_id drop not null;
