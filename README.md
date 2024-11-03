# ReactMate

ReactMate is a modern, responsive chess application built with React.js and Vite. It provides a fully functional chess analysis board with a clean, intuitive interface and comprehensive chess rule implementation.

![ReactMate Screenshot](/ReactMate.png)

## Live Demo

🎮 [Play ReactMate](https://react-mate-seven.vercel.app/)

## Features

### Chess Rules Implementation

- Complete traditional chess move validation
- Advanced chess features:
  - Castling (both kingside and queenside)
  - En passant captures
  - Pawn promotion
  - Check detection and highlight
  - Checkmate detection
  - Stalemate detection
  - Draw detection due to insufficient material

### User Interface

- Responsive design with three breakpoints:
  - Mobile (≤ 400px)
  - Tablet (576px - 991px)
  - Desktop (≥ 992px)
- Intuitive drag-and-drop piece movement (desktop)
- Visual highlights for:
  - Legal move candidates
  - Last move made
  - King in check
  - Movement squares
- Move history panel with algebraic notation
- Take-back functionality for move analysis

### Technical Features

- Built with React.js + Vite for optimal performance
- Customizable styling using CSS custom properties
- Modular and maintainable code structure
- State management using React Context and useReducer
- Accessible design with ARIA labels and roles
- Responsive across all device sizes

## Future Updates

- Mobile touch movement support
- Multiplayer mode
- Backend integration
- Game analysis tools
- Opening book integration
- User accounts and game saving
- Rating system

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/reactmate.git
```

2. Navigate to project directory:

```bash
cd reactmate
```

3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

## Project Structure (Tentative!)

```
reactmate/
├── src/
│   ├── components/
│   │   ├── board/
│   │   ├── controls/
│   │   ├── modals/
│   │   └── positions/
│   ├── contexts/
│   ├── reducers/
│   ├── arbiter/
│   └── utils/
├── public/
│   └── images/
└── ...
```

## Technologies Used

- React.js
- Vite
- CSS3 with Custom Properties
- HTML5 Drag and Drop API
- Context API
- React Hooks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

[Dhrubajyoti Bhattacharjee](https://www.linkedin.com/in/dhrubajyoti-bhattacharjee-320822318/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
