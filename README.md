# 📚 Biblioteca Druídica

> *"O conhecimento contido nos antigos tomos não desaparece com o tempo; ele apenas aguarda por novos guardiões dispostos a preservá-lo."*

A **Biblioteca Druídica** é uma plataforma digital e acervo comunitário, sem fins lucrativos, criada com a missão de **preservar, organizar e democratizar o acesso à literatura de RPG de Mesa (TTRPG)** em língua portuguesa.

---

## 📜 História e Propósito do Projeto

### O Ponto de Partida: A Queda da Biblioteca Élfica (2019)
Durante muitos anos, a **Biblioteca Élfica** foi o pilar central da comunidade brasileira de RPG, servindo como o maior ponto de encontro para quem buscava manuais raros, cenários de campanha, fichas e suplementos traduzidos. Em **2019**, no entanto, o encerramento inesperado das atividades da Élfica deixou um enorme vazio digital: comunidades se viram desamparadas, acervos históricos foram perdidos e novos jogadores encontraram barreiras para ingressar no hobby.

Diante desse cenário, a **Biblioteca Druídica** foi idealizada no mesmo ano. O objetivo não era apenas criar mais um repositório de arquivos, mas erguer um **santuário digital organizado** — um novo refúgio onde o material acumulado por anos pela comunidade pudesse ser catalogado com carinho, facilidade de busca e acesso rápido para qualquer pessoa.

### A Evolução do Acervo
O que começou em 2019 como um esforço de resgate e organização em pastas compartilhadas evoluiu para uma **plataforma web leve, moderna e responsiva**. O site foi desenvolvido para funcionar sem a necessidade de bancos de dados complexos ou infraestruturas pesadas, garantindo que o acervo permaneça acessível e rápido até mesmo em conexões lentas ou dispositivos móveis mais simples.

Hoje, a biblioteca reúne centenas de títulos que cobrem desde os grandes clássicos do mercado até cenários e sistemas *indies* brasileiros, incluindo:

* 🐉 **Dungeons & Dragons:** Edições clássicas, D&D 3.5, D&D 5E e suplementos raros.
* 🦇 **Mundo das Trevas (World of Darkness):** *Vampiro: A Máscara*, *Mago: A Ascensão*, *Vampiro: O Réquiem* e *A Idade das Trevas*.
* 🐙 **Horror Cósmico:** *Chamado de Cthulhu*, *Rastro de Cthulhu* e obras do mito Lovecraftiano.
* ⚔️ **Sistemas Nacionais e Alternativos:** *Tormenta*, *Old Dragon*, *13ª Era*, *7º Mar*, *Violentina*, *Angus RPG* e diversos jogos independentes.

### Nossa Filosofia
Acreditamos que o RPG de mesa é uma das formas mais ricas de arte narrativa, educação e socialização. A Biblioteca Druídica existe para garantir que a memória desse hobby continue viva, respeitada e acessível para velhos mestres e novas gerações de aventureiros.

---

## ✨ Funcionalidades do Site

- 🔍 **Busca em Tempo Real:** Pesquise instantaneamente por título ou autor.
- 📂 **Filtro por Categorias e Sistemas:** Navegação fluida e categorizada via menu lateral.
- 📄 **Paginação Dinâmica:** Escolha exibir 20, 40 ou 60 tomos por página.
- 📖 **Detalhes do Tomo:** Visualização de capa em alta qualidade, resumo descritivo e link direto para visualização via Google Drive.
- ⚡ **Arquitetura Baseada em YAML:** Todo o acervo é gerenciado via arquivos YAML simples (`books.yml` e `descriptions.yml`), facilitando a manutenção comunitária.
- 📱 **Design Responsivo & Sanitizado:** Interface moderna construída com Tailwind CSS, incluindo sanitização de caracteres e acentuação em tempo de execução.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React.js](https://react.dev/) (via CDN / Babel standalone)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) & FontAwesome 6 Icons
- **Parser de Dados:** [js-yaml](https://github.com/nodeca/js-yaml)
- **Hospedagem:** GitHub Pages

---

## 📁 Estrutura dos Arquivos de Dados

O acervo é mantido e atualizado diretamente na pasta `/data`:

- **`data/books.yml`**: Contém a lista de todos os livros cadastrados.
  ```yaml
  - title: "Livro do Jogador 5ª Edição"
    author: "Wizards of the Coast"
    category: "D&D 5E"
    imageUrl: "[https://link-da-capa.jpg](https://link-da-capa.jpg)"
    driveLink: "[https://drive.google.com/file/d/](https://drive.google.com/file/d/)..."

