-- Migrate from Xenova/all-MiniLM-L6-v2 (384 dims) to Voyage voyage-3-lite (512 dims)

drop function if exists match_chunks;
drop table if exists chunks;

create table chunks (
  id bigserial primary key,
  source text not null,
  heading text,
  content text not null,
  embedding vector(512)
);

grant all on chunks to postgres, anon, authenticated, service_role;
grant usage, select on sequence chunks_id_seq to postgres, anon, authenticated, service_role;

create or replace function match_chunks(
  query_embedding vector(512),
  match_count int default 5,
  match_threshold float default 0.4
)
returns table (
  id bigint,
  source text,
  heading text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    id,
    source,
    heading,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

create index if not exists chunks_embedding_idx
  on chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);
