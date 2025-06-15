let booksData = [];
let descriptionsData = {};

async function loadBooksData() {
  try {
    const r = await fetch('./data/books.yml');
    if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
    const e = await r.text();
    booksData = jsyaml.load(e);
    console.log('Dados dos livros carregados:', booksData);

    const descRes = await fetch('./data/descriptions.yml');
    if (!descRes.ok) throw new Error(`HTTP error! status: ${descRes.status}`);
    const descText = await descRes.text();
    descriptionsData = jsyaml.load(descText).reduce((acc, item) => {
      acc[item.title] = item.description;
      return acc;
    }, {});
    console.log('Dados das descrições carregados:', descriptionsData);

    ReactDOM.createRoot(document.getElementById('root-app')).render(<App />);
  } catch (r) {
    console.error('Erro ao carregar os dados:', r);
    document.getElementById('root-app').innerHTML =
      '<p class="text-red-500 text-center text-xl mt-20">Erro ao carregar os livros. Por favor, tente novamente mais tarde.</p>';
  }
}
loadBooksData();

const Book = ({ title, author, imageUrl, onSelectBook }) => {
  return (
    <article
      className="bg-gray-800 bg-opacity-0 hover:bg-opacity-50 p-4 rounded-lg shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer h-full"
      onClick={onSelectBook}
    >
      <figure className="book-cover mb-4 flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-48 h-64 object-cover rounded-md shadow-md"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/192x256/2d3748/e2e8f0?text=Capa';
          }}
        />
      </figure>
      <div className="book-info flex flex-col justify-start flex-grow">
        <h2 className="text-white text-lg font-semibold mb-1">{title}</h2>
        <p className="text-gray-400 text-sm">{author}</p>
      </div>
    </article>
  );
};

const BookDetail = ({ book, onBackToList }) => {
  return (
    <div className="flex flex-col items-center bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
      <button
        onClick={onBackToList}
        className="self-start mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
      >
        &larr; Voltar
      </button>
      <h1 className="text-white text-4xl font-bold mb-4 text-center">
        {book.title}
      </h1>
      <p className="text-gray-300 text-lg mb-6 text-center">
        Por: {book.author}
      </p>
      <div className="book-cover mb-8">
        <a href={book.driveLink} target="_blank" rel="noopener noreferrer">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-80 h-auto object-cover rounded-lg shadow-lg border-4 border-gray-700 hover:border-green-500 transition-colors"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://placehold.co/320x420/2d3748/e2e8f0?text=Capa+Indisponível';
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
};

const Sidebar = ({ isMenuOpen, toggleMenu, handleNavigate }) => {
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const submenuRefs = React.useRef({});

  React.useEffect(() => {
    const e = document.getElementById('sidebar');
    if (e) {
      if (isMenuOpen) {
        e.classList.add('active');
      } else {
        e.classList.remove('active');
      }
    }
  }, [isMenuOpen]);

  React.useEffect(() => {
    Object.keys(submenuRefs.current).forEach((e) => {
      const t = submenuRefs.current[e];
      t &&
        (activeDropdown === e
          ? (t.style.maxHeight = t.scrollHeight + 'px')
          : (t.style.maxHeight = '0px'));
    });
  }, [activeDropdown]);

  const toggleDropdown = (e) => {
    setActiveDropdown(activeDropdown === e ? null : e);
  };

  const handleNavLinkClick = (e, t) => {
    handleNavigate(e, t);
    if (window.innerWidth <= 768) toggleMenu();
  };

  const categories = {
    'Dungeons & Dragons': ['D&D 5E', 'D&D 3.5'],
    'Mundo das Trevas': [
      'Mago a Ascensão',
      'Vampiro a Máscara',
      'Vampiro a Idade das Trevas',
      'Vampiro o Réquiem',
    ],
    'Cthulhu Mythos': ['Chamado de Cthulhu', 'Rastro de Cthulhu'],
    'Outros Sistemas': [
      'Tormenta',
      'Old Dragon',
      '13ª Era',
      '7º Mar',
      'Violentina',
      'Angus RPG',
      '2Q RPG',
      'Ação!!!',
    ],
  };

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <i className="fa-solid fa-dungeon logo-icon"></i>
        <span className="logo-text">Bib. Druídica</span>
      </div>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link" onClick={() => handleNavLinkClick('home')}>
            <i className="fa-solid fa-house icon"></i>
            <span className="text">Início</span>
          </a>
        </li>
        {Object.entries(categories).map(([e, t]) => (
          <li
            key={e}
            className={`nav-item has-dropdown ${
              activeDropdown === e ? 'dropdown-active' : ''
            }`}
          >
            <a className="nav-link" onClick={() => toggleDropdown(e)}>
              <i
                className={`fa-solid ${
                  e === 'Dungeons & Dragons'
                    ? 'fa-dragon'
                    : e === 'Mundo das Trevas'
                    ? 'fa-hat-wizard'
                    : e === 'Cthulhu Mythos'
                    ? 'fa-book-skull'
                    : 'fa-scroll'
                } icon`}
              ></i>
              <span className="text">{e}</span>
              <i className="fa-solid fa-chevron-right dropdown-arrow"></i>
            </a>
            <ul className="submenu" ref={(a) => (submenuRefs.current[e] = a)}>
              {t.map((s) => (
                <li key={s}>
                  <a
                    className="submenu-link"
                    onClick={() => handleNavLinkClick('category', s)}
                  >
                    {s}
                  </a>
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

  const handleNavigate = (e, t = '') => {
    setCurrentView(e);
    setSelectedCategory(t);
    setSelectedBook(null);
    setSearchTerm('');
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  const handleSelectBook = (book) => {
    const description =
      descriptionsData[book.title] || 'Nenhuma descrição disponível neste tomo.';
    setSelectedBook({ ...book, description });
    setCurrentView('book');
    window.scrollTo(0, 0);
  };

  const toggleMenu = () => {
    setIsMenuOpen((e) => !e);
  };

  const handleBooksPerPageChange = (e) => {
    setBooksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const filteredBooksCount = React.useMemo(() => {
    let e = booksData;
    if (currentView === 'category' && selectedCategory) {
      e = booksData.filter((e) => e.category === selectedCategory);
    }
    if (searchTerm) {
      e = e.filter(
        (e) =>
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return e.length;
  }, [currentView, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredBooksCount / booksPerPage);

  const booksForDisplay = React.useMemo(() => {
    let e = booksData;
    if (currentView === 'category' && selectedCategory) {
      e = booksData.filter((e) => e.category === selectedCategory);
    }
    if (searchTerm) {
      e = e.filter(
        (e) =>
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const t = currentPage * booksPerPage;
    const s = t - booksPerPage;
    return e.slice(s, t);
  }, [currentView, selectedCategory, searchTerm, currentPage, booksPerPage]);

  const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center mt-8 mb-8 space-x-4 flex-wrap gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((e, t) => (
          <button
            key={t + 1}
            onClick={() => setCurrentPage(t + 1)}
            className={`px-4 py-2 rounded-lg transition-colors shadow-md ${
              currentPage === t + 1
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {t + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          Próximo
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (currentView === 'book' && selectedBook) {
      return (
        <BookDetail
          book={selectedBook}
          onBackToList={() =>
            handleNavigate(selectedCategory ? 'category' : 'home', selectedCategory)
          }
        />
      );
    }
    let e = 'Biblioteca Druídica',
      t = 'Seu acervo digital de livros de RPG.';
    if (currentView === 'category') {
      e = selectedCategory;
      t = `Livros e suplementos para ${selectedCategory}.`;
    }
    return (
      <>
        <div className="text-center mb-10 pt-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{e}</h1>
          <p className="text-lg text-gray-300">{t}</p>
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
              onChange={handleBooksPerPageChange}
              className="appearance-none w-full sm:w-auto px-5 py-3 rounded-full transition-shadow pr-10 cursor-pointer bg-gray-700 border border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="20">20 livros</option>
              <option value="40">40 livros</option>
              <option value="60">60 livros</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338 9.293 12.95z" />
              </svg>
            </div>
          </div>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {booksForDisplay.length > 0 ? (
            booksForDisplay.map((e) => (
              <Book
                key={e.driveLink}
                title={e.title}
                author={e.author}
                imageUrl={e.imageUrl}
                onSelectBook={() => handleSelectBook(e)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 text-xl">
              Nenhum livro encontrado.
            </p>
          )}
        </section>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </>
    );
  };

  React.useEffect(() => {
    const e = document.getElementById('sidebar');
    const t = document.querySelector('.menu-toggle');
    const s = (a) => {
      if (e && t && isMenuOpen && !e.contains(a.target) && !t.contains(a.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', s);

    if (isMenuOpen && window.innerWidth <= 768) {
      document.body.style.marginLeft = '0';
      document.body.classList.add('overflow-hidden');
    } else if (isMenuOpen && window.innerWidth > 768) {
      document.body.style.marginLeft = 'var(--sidebar-width)';
    } else {
      document.body.style.marginLeft = '0';
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', s);
    };
  }, [isMenuOpen]);

  React.useEffect(() => {
    const e = (e) => e.preventDefault();
    document.addEventListener('contextmenu', e);
    return () => document.removeEventListener('contextmenu', e);
  }, []);

  return (
    <div className="min-h-screen text-gray-100 font-inter antialiased">
      <Sidebar
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        handleNavigate={handleNavigate}
      />
      <button
        className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <i className={`fa-solid fa-bars ${isMenuOpen ? 'hidden' : ''}`}></i>
        <i className={`fa-solid fa-xmark ${isMenuOpen ? '' : 'hidden'}`}></i>
      </button>
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
      <footer className="bg-black bg-opacity-30 backdrop-blur-sm p-6 text-center text-gray-400 mt-12 rounded-t-lg">
        <p>&copy; {new Date().getFullYear()} Biblioteca Druídica. Todos os direitos reservados.</p>
        <div className="mt-4">
          <p>
            Visite o canal na Twitch:
            <a
              href="https://www.twitch.tv/lukas_eso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              lukas_eso
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
