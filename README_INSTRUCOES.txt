JT CAPITAL 5.0 + JARVIS CAPITAL 4.0
===================================

ENTREGA
- public/index.html: aplicativo original preservado + interface JARVIS 4.0
- public/jarvis4.css e public/jarvis4.js: interface e integração
- netlify/functions/news.mjs: feed RSS de notícias (consulta online)
- netlify/functions/market.mjs: Banco Central SGS (dados oficiais)
- netlify/functions/ai.mjs: API OpenAI (requer chave e login online)
- netlify/functions/login.mjs: login separado com Supabase Auth
- netlify/functions/config.mjs: status das integrações
- netlify.toml: build com pasta public e funções fora dela

PUBLICAÇÃO
IMPORTANTE: por conter funções backend, não basta subir o index.html no Netlify Drop.
Opção recomendada: criar um repositório PRIVADO GitHub com esta estrutura e conectar
à publicação contínua do SITE EXISTENTE no Netlify (ou usar Netlify CLI com build).
No Netlify, manter a pasta publish = public e functions = netlify/functions.
Ao usar Netlify CLI autenticado: executar `netlify deploy --build --prod`
a partir da pasta raiz. Confirme primeiro que a conta/site ativo é o desejado.

AMBIENTE — Netlify Site configuration > Environment variables
OPENAI_API_KEY=chave_secreta_que_voce_configura
OPENAI_MODEL=gpt-5.4 (ou modelo disponível na sua conta)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=chave_anon_publicavel

Em Supabase Authentication, criar sua conta de acesso online e configurar corretamente
as permissões de autenticação. Na aba Configurações do JARVIS, conectar com email/senha.
O login atual do JT Capital permanece LOCAL; ele não autoriza chamadas da IA.
Nenhuma API usa a chave service_role do Supabase.

NOTÍCIAS E RADAR
Quando o site estiver publicado com as functions, Notícias consulta RSS do
Google Notícias (pode não apresentar imagens quando a fonte não fornece imagens).
Radar consulta séries BCB, com data oficial e sem fingir preços instantâneos.
O RSS pode falhar ou mudar de formato, por isso há aviso de falha em vez de dado falso.

IA E CUSTOS
A IA usa API OpenAI e pesquisa na web, sujeita a uso pago e limites de sua conta.
As perguntas são enviadas ao provedor quando a conta online está conectada.
Dados da carteira NÃO são compartilhados por padrão. É possível marcar consentimento
para enviar apenas um resumo numérico agregador nesta sessão. Nunca enviar nomes.
Sessão de login armazenada apenas em memória, perdida ao atualizar a página.
Sem OPENAI_API_KEY / Supabase Auth, o JARVIS mantém consultas LOCAIS.

AVISOS E LIMITAÇÕES
- Não foi possível executar consulta em produção sem sua chave de API e deploy.
- Não há monitoramento ou notificações automáticas em segundo plano.
- Notícias/indicadores não são exibidos sem uma conexão real ao servidor.
- O sistema legado e o IndexedDB foram preservados; faça backup antes do deploy.
- Login local existente não equivale a autenticação segura de servidor.
- Não usar somente Netlify Drop para hospedar esta versão completa com funções.
