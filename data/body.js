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
    className="bg-gray-800 bg-opacity-0 hover:bg-opacity-50 p-4 rounded-lg flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
    onClick={onSelectBook}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onSelectBook();
    }}
  >
    <figure className="book-cover mb-4 flex-shrink-0 w-full max-w-xs sm:max-w-none">
      <img
        src={imageUrl}
        alt={title}
        className="rounded-md shadow-md"
        style={{ width: '240px', maxWidth: '80vw', height: '320px', objectFit: 'cover' }}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://placehold.co/240x320/2d3748/e2e8f0?text=Capa';
        }}
      />
    </figure>
    <div className="book-info flex flex-col justify-start flex-grow w-full">
      <h2 className="text-white text-lg font-semibold mb-1 truncate">{title}</h2>
      <p className="text-gray-400 text-sm truncate">{author}</p>
    </div>
  </article>
);

const BookDetail = ({ book, onBackToList }) => (
  <div className="flex flex-col items-center bg-gray-800 bg-opacity-50 p-6 sm:p-8 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
    <button
      onClick={onBackToList}
      className="self-start mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
    >
      &larr; Voltar
    </button>
    <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4 text-center">{book.title}</h1>
    <p className="text-gray-300 text-lg mb-6 text-center">Por: {book.author}</p>
    <div className="book-cover mb-8 w-full flex justify-center">
      <a href={book.driveLink} target="_blank" rel="noopener noreferrer">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="rounded-lg shadow-lg border-4 border-gray-700 hover:border-green-500 transition-colors"
          style={{ width: '420px', maxWidth: '90vw', height: '560px', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/420x560/2d3748/e2e8f0?text=Capa+Indisponível';
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
              <i className={`fa-solid ${categoryName === 'Dungeons & Dragons' ? 'fa-dragon' : categoryName === 'Mundo das Trevas' ? 'fa-hat-wizard' : categoryName === 'Cthulhu Mythos' ? 'fa-book' : 'fa-folder'}`}></i>
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

