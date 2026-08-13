async function loadBooksData() {
  try {
    // 1. Faz o fetch e lê o texto dos dois arquivos YAML simultaneamente
    const [booksRes, descRes] = await Promise.all([
      fetch('data/books.yml'),
      fetch('data/descriptions.yml')
    ]);

    if (!booksRes.ok || !descRes.ok) {
      throw new Error('Não foi possível carregar os arquivos YAML de dados.');
    }

    const [booksYamlText, descYamlText] = await Promise.all([
      booksRes.text(),
      descRes.text()
    ]);

    // 2. Converte o texto YAML em objetos JavaScript usando o js-yaml
    const rawBooks = jsyaml.load(booksYamlText);
    const rawDescriptions = jsyaml.load(descYamlText);

    // 3. Sanitiza e atualiza as variáveis globais do acervo
    booksData = sanitizeBooks(rawBooks || []);
    descriptionsData = sanitizeDescriptions(rawDescriptions || []);

    const root = document.getElementById('root-app');
    if (!root) throw new Error('Elemento root-app não encontrado.');

    // 4. Renderiza a aplicação após carregar os dados
    ReactDOM.createRoot(root).render(<App />);
  } catch (error) {
    console.error('Erro ao carregar a aplicação:', error);
    const root = document.getElementById('root-app');
    if (root) {
      root.innerHTML = `
        <div style="max-width: 720px; margin: 48px auto; padding: 24px; color: #fca5a5; background: rgba(17,24,39,.9); border: 1px solid rgba(248,113,113,.3); border-radius: 12px; font-family: Inter, sans-serif;">
          <h1 style="margin: 0 0 12px; color: #fff;">Falha ao iniciar a biblioteca</h1>
          <p style="margin: 0 0 12px;">${String(error.message || error)}</p>
          <p style="margin: 0; color: #d1d5db;">Confirme se os arquivos <code>data/books.yml</code> e <code>data/descriptions.yml</code> existem e estão acessíveis no servidor.</p>
        </div>
      `;
    }
  }
}

loadBooksData();
