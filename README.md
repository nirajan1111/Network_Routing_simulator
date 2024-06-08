# NETWORK_ROUTING_SIMULATOR

## Overview
NETWORK_ROUTING_SIMULATOR is a web-based application built using React with TypeScript and Three.js. It provides a visual representation of Dijkstra's shortest path algorithm on a 3D Earth model. Users can place multiple objects on the surface of the Earth using simple mouse clicks and observe the shortest path for data travel from a start object to an end object.

## Features
- **3D Earth Visualization**: An interactive 3D model of the Earth using Three.js.
- **Object Placement**: Users can place multiple objects on the Earth's surface with mouse clicks.
- **Shortest Path Visualization**: Implements Dijkstra's algorithm to find and visualize the shortest path between objects.
- **React and TypeScript**: Developed with modern web technologies for robust and scalable performance.

## Installation

### Prerequisites
- Node.js (version 14 or later)
- npm (version 6 or later)

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/NETWORK_ROUTING_SIMULATOR.git
    ```
2. Navigate to the project directory:
    ```sh
    cd NETWORK_ROUTING_SIMULATOR
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Start the development server:
    ```sh
    npm start
    ```
5. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage
1. Open the application in your browser.
2. Click on the surface of the 3D Earth to place objects.
3. Select a start object and an end object.
4. The application will compute and display the shortest path between the selected objects using Dijkstra's algorithm.

## Project Structure
- `src/`: Contains the source code for the project.
  - `components/`: Reusable React components.
  - `utils/`: Utility functions, including the implementation of Dijkstra's algorithm.
  - `assets/`: Static assets such as images and models.
  - `App.tsx`: The main application component.
- `public/`: Public assets and the HTML template.

## Technologies Used
- **React**: For building the user interface.
- **TypeScript**: For type safety and enhanced development experience.
- **Three.js**: For rendering the 3D Earth model.
- **Dijkstra's Algorithm**: For calculating the shortest path.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or feedback, please open an issue on the repository or contact the project maintainer at [your-email@example.com].

---

Happy coding! 🚀
