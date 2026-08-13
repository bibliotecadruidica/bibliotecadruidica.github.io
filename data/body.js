let booksData = [];
let descriptionsData = {};

// --- FUNÇÕES UTILITÁRIAS E DE SANITIZAÇÃO ---

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFC')
    .replaceAll('Ã¡', 'á')
    .replaceAll('Ã©', 'é')
    .replaceAll('Ã­', 'í')
    .replaceAll('Ã³', 'ó')
    .replaceAll('Ãº', 'ú')
    .replaceAll('Ã£', 'ã')
    .replaceAll('Ãµ', 'õ')
    .replaceAll('Ã¢', 'â')
    .replaceAll('Ãª', 'ê')
    .replaceAll('Ã´', 'ô')
    .replaceAll('Ã§', 'ç')
    .replaceAll('DruÃ­dica', 'Druídica')
    .replaceAll('descriÃ§Ãµes', 'descrições')
    .replaceAll('IndisponÃ­vel', 'Indisponível')
    .replaceAll('botÃ£o', 'botão')
    .replaceAll('ColeÃ§Ãµes', 'Coleções');

const sanitizeBooks = (items) =>
  (items || []).map((book) => ({
    ...book,
    title: normalizeText(book.title),
    author: normalizeText(book.author),
    category: normalizeText(book.category),
  }));

const sanitizeDescriptions = (items) =>
  (items || []).reduce((acc, item) => {
    acc[normalizeText(item.title)] = normalizeText(item.description);
    return acc;
  }, {});

// --- COMPONENTES REACT ---

const Book = ({ title, author, imageUrl, onSelectBook }) => (
  <article
    className="bg-gray-800 bg-opacity-0 hover:bg-opacity-50 p-4 rounded-lg shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer h-full"
    onClick={onSelectBook}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onSelectBook();
    }}
  >
    <figure className="book-cover mb-4 flex-shrink-0">
      <img
        src={imageUrl}
        alt={title}
        className="w-48 h-64 object-cover rounded-md shadow-md"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://placehold.co/192x256/2d3748/e2e8f0?text=Capa';
        }}
      />
    </figure>
    <div className="book-info flex flex-col justify-start flex-grow">
      <h2 className="text-white text-lg font-semibold mb-1">{title}</h2>
      <p className="text-gray-400 text-sm">{author}</p>
    </div>
  </article>
);

const BookDetail = ({ book, onBackToList }) => (
  <div className="flex flex-col items-center bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
    <button
      onClick={onBackToList}
      className="self-start mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
    >
      &larr; Voltar
    </button>
    <h1 className="text-white text-4xl font-bold mb-4 text-center">{book.title}</h1>
    <p className="text-gray-300 text-lg mb-6 text-center">Por: {book.author}</p>
    <div className="book-cover mb-8">
      <a href={book.driveLink} target="_blank" rel="noopener noreferrer">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-80 h-auto object-cover rounded-lg shadow-lg border-4 border-gray-700 hover:border-green-500 transition-colors"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/320x420/2d3748/e2e8f0?text=Capa+Indisponível';
          }}
        />
      </a>
    </div>
    <a
      href={book.driveLink}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
    >
      Acessar no Google Drive
    </a>
    <p className="text-gray-400 text-sm mt-4 text-center">
      Clique na capa ou no botão para abrir o arquivo no Google Drive.
    </p>
    {book.description && (
      <p className="text-gray-300 text-base mt-6 text-center leading-relaxed max-w-prose">
        {book.description}
      </p>
    )}
  </div>
);

const Sidebar = ({ isMenuOpen, toggleMenu, handleNavigate }) => {
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const submenuRefs = React.useRef({});

  React.useEffect(() => {
    document.getElementById('sidebar')?.classList.toggle('active', isMenuOpen);
  }, [isMenuOpen]);

  React.useEffect(() => {
    Object.keys(submenuRefs.current).forEach((key) => {
      const element = submenuRefs.current[key];
      if (!element) return;
      element.style.maxHeight = activeDropdown === key ? `${element.scrollHeight}px` : '0px';
    });
  }, [activeDropdown]);

  const categories = {
    'Dungeons & Dragons': ['D&D 5E', 'D&D 3.5'],
    'Mundo das Trevas': ['Mago a Ascensão', 'Vampiro a Máscara', 'Vampiro a Idade das Trevas', 'Vampiro o Réquiem'],
    'Cthulhu Mythos': ['Chamado de Cthulhu', 'Rastro de Cthulhu'],
    'Outros Sistemas': ['Tormenta', 'Old Dragon', '13ª Era', '7º Mar', 'Violentina', 'Angus RPG', '2Q RPG', 'Ação!!!'],
  };

  const handleNavLinkClick = (type, value = '') => {
    handleNavigate(type, value);
    if (window.innerWidth <= 768) toggleMenu();
  };

  return (
    <nav className="sidebar" id="sidebar" aria-label="Navegação principal">
      <div className="sidebar-header">
        <i className="fa-solid fa-dungeon logo-icon"></i>
        <span className="logo-text">Bib. Druídica</span>
      </div>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <button className="nav-link" onClick={() => handleNavLinkClick('home')}>
            <i className="fa-solid fa-house icon"></i>
            <span className="text">Início</span>
          </button>
        </li>
        {Object.entries(categories).map(([categoryName, items]) => (
          <li key={categoryName} className={`nav-item has-dropdown ${activeDropdown === categoryName ? 'dropdown-active' : ''}`}>
            <button className="nav-link" onClick={() => setActiveDropdown(activeDropdown === categoryName ? null : categoryName)}>
              <i className={`fa-solid ${categoryName === 'Dungeons & Dragons' ? 'fa-dragon' : categoryName === 'Mundo das Trevas' ? 'fa-hat-wizard' : categoryName === 'Cthulhu Mythos' ? 'fa-book-skull' : 'fa-scroll'} icon`}></i>
              <span className="text">{categoryName}</span>
              <i className="fa-solid fa-chevron-right dropdown-arrow"></i>
            </button>
            <ul className="submenu" ref={(ref) => (submenuRefs.current[categoryName] = ref)}>
              {items.map((subcategory) => (
                <li key={subcategory}>
                  <button className="submenu-link" onClick={() => handleNavLinkClick('category', subcategory)}>
                    {subcategory}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const App = () => {
  const [currentView, setCurrentView] = React.useState('home');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [booksPerPage, setBooksPerPage] = React.useState(20);
  const booksPerPageOptions = [20, 40, 60];
  const totalBooks = booksData.length;

  const handleNavigate = (view, category = '') => {
    setCurrentView(view);
    setSelectedCategory(category);
    setSelectedBook(null);
    setSearchTerm('');
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  const handleSelectBook = (book) => {
    const description = descriptionsData[book.title] || 'Nenhuma descrição disponível neste tomo.';
    setSelectedBook({ ...book, description });
    setCurrentView('book');
    window.scrollTo(0, 0);
  };

  const toggleMenu = () => setIsMenuOpen((value) => !value);

  const filteredBooks = React.useMemo(() => {
    let items = booksData;
    if (currentView === 'category' && selectedCategory) {
      items = items.filter((book) => book.category === selectedCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (book) => book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term),
      );
    }
    return items;
  }, [currentView, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const booksForDisplay = React.useMemo(() => {
    const start = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(start, start + booksPerPage);
  }, [filteredBooks, currentPage, booksPerPage]);

  const firstItemIndex = filteredBooks.length === 0 ? 0 : (currentPage - 1) * booksPerPage + 1;
  const lastItemIndex = Math.min(currentPage * booksPerPage, filteredBooks.length);

  const pageWindow = React.useMemo(() => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const windowSize = 10;
    const halfWindow = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = start + windowSize - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }

    const pages = [];
    if (start > 1) pages.push(1);
    if (start > 2) pages.push('ellipsis-left');
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < totalPages - 1) pages.push('ellipsis-right');
    if (end < totalPages) pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const PaginationControls = ({ page, total, setPage }) => {
    if (total <= 1) return null;
    return (
      <div className="flex flex-col items-center gap-3 mt-8 mb-8">
        <p className="text-sm text-gray-300">
          Mostrando {firstItemIndex}-{lastItemIndex} de {filteredBooks.length} livros filtrados de um total de {totalBooks} livros na biblioteca
        </p>
        <div className="flex justify-center items-center flex-wrap gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            Anterior
          </button>
          {pageWindow.map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`px-3 py-2 rounded-lg transition-colors shadow-md min-w-10 ${page === item ? 'bg-green-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="px-2 py-2 text-gray-400 select-none">...</span>
            ),
          )}
          <button
            onClick={() => setPage((prev) => Math.min(total, prev + 1))}
            disabled={page === total}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            Próximo
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (currentView === 'book' && selectedBook) {
      return <BookDetail book={selectedBook} onBackToList={() => handleNavigate(selectedCategory ? 'category' : 'home', selectedCategory)} />;
    }

    let title = 'Biblioteca Druídica';
    let subtitle = 'Seu acervo digital de livros de RPG.';
    if (currentView === 'category') {
      title = selectedCategory;
      subtitle = `Livros e suplementos para ${selectedCategory}.`;
    }

    return (
      <>
        <div className="text-center mb-10 pt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{title}</h1>
          <p className="text-lg text-gray-300">{subtitle}</p>
          {currentView === 'category' && (
            <button
              onClick={() => handleNavigate('home')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              &larr; Voltar para o Início
            </button>
          )}
        </div>
        <div className="mb-10 w-full max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            className="w-full px-5 py-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            value={searchTerm}
          />
          <div className="relative">
            <select
              value={booksPerPage}
              onChange={(e) => {
                setBooksPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none w-full sm:w-auto px-5 py-3 rounded-full transition-shadow pr-10 cursor-pointer bg-gray-700 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {booksPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} livros
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338 9.293 12.95z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-4 text-center text-sm text-gray-400">
          {filteredBooks.length} livro(s) encontrados de {totalBooks} livros na biblioteca | {booksPerPage} por página | {totalPages} página(s)
        </div>
        <PaginationControls page={currentPage} total={totalPages} setPage={setCurrentPage} />
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {booksForDisplay.length > 0 ? (
            booksForDisplay.map((book) => (
              <Book
                key={book.driveLink}
                title={book.title}
                author={book.author}
                imageUrl={book.imageUrl}
                onSelectBook={() => handleSelectBook(book)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 text-xl">Nenhum livro encontrado.</p>
          )}
        </section>
        <PaginationControls page={currentPage} total={totalPages} setPage={setCurrentPage} />
      </>
    );
  };

  React.useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    const menu = document.querySelector('.menu-toggle');
    const handleOutsideClick = (event) => {
      if (sidebar && menu && isMenuOpen && !sidebar.contains(event.target) && !menu.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    if (isMenuOpen && window.innerWidth <= 768) {
      document.body.style.marginLeft = '0';
      document.body.classList.add('overflow-hidden');
    } else if (isMenuOpen && window.innerWidth > 768) {
      document.body.style.marginLeft = 'var(--sidebar-width)';
    } else {
      document.body.style.marginLeft = '0';
      document.body.classList.remove('overflow-hidden');
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  React.useEffect(() => {
    const disableContextMenu = (event) => event.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);
    return () => document.removeEventListener('contextmenu', disableContextMenu);
  }, []);

  return (
    <div className="min-h-screen text-gray-100 font-inter antialiased">
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} handleNavigate={handleNavigate} />
      <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Alternar menu">
        <i className={`fa-solid fa-bars ${isMenuOpen ? 'hidden' : ''}`}></i>
        <i className={`fa-solid fa-xmark ${isMenuOpen ? '' : 'hidden'}`}></i>
      </button>
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
      <footer className="bg-black bg-opacity-30 backdrop-blur-sm p-6 text-center text-gray-400 mt-12 rounded-t-lg">
        <p>&copy; {new Date().getFullYear()} Biblioteca Druídica. Todos os direitos reservados.</p>
        <div className="mt-4">
          <p>
            Visite o canal na Twitch:{' '}
            <a href="https://www.twitch.tv/lukas_eso" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
              lukas_eso
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- CARREGAMENTO DOS YMLS E INICIALIZAÇÃO DA APLICAÇÃO ---

async function loadBooksData() {
  try {
    const [booksRes, descRes] = await Promise.all([
      fetch('data/books.yml'),
      fetch('data/descriptions.yml'),
    ]);

    if (!booksRes.ok || !descRes.ok) {
      throw new Error('Não foi possível carregar os arquivos YAML de dados. Verifique a pasta "data".');
    }

    const [booksYamlText, descYamlText] = await Promise.all([
      booksRes.text(),
      descRes.text(),
    ]);

    if (typeof jsyaml === 'undefined') {
      throw new Error('A biblioteca js-yaml não foi carregada no seu HTML.');
    }

    const rawBooks = jsyaml.load(booksYamlText);
    const rawDescriptions = jsyaml.load(descYamlText);

    booksData = sanitizeBooks(rawBooks || []);
    descriptionsData = sanitizeDescriptions(rawDescriptions || []);

    const root = document.getElementById('root-app');
    if (!root) throw new Error('Elemento root-app não encontrado.');

    ReactDOM.createRoot(root).render(<App />);
  } catch (error) {
    console.error('Erro ao carregar a aplicação:', error);
    const root = document.getElementById('root-app');
    if (root) {
      root.innerHTML = `
        <div style="max-width: 720px; margin: 48px auto; padding: 24px; color: #fca5a5; background: rgba(17,24,39,.9); border: 1px solid rgba(248,113,113,.3); border-radius: 12px; font-family: Inter, sans-serif;">
          <h1 style="margin: 0 0 12px; color: #fff;">Falha ao iniciar a biblioteca</h1>
          <p style="margin: 0 0 12px;">${String(error.message || error)}</p>
          <p style="margin: 0; color: #d1d5db;">Confirme se os arquivos <code>data/books.yml</code> e <code>data/descriptions.yml</code> existem e se a CDN do <code>js-yaml</code> foi adicionada ao HTML.</p>
        </div>
      `;
    }
  }
}

loadBooksData();
