// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserInteraction {
    // Estructura de interacción
    struct Interaction {
        string action;    // Acción realizada por el usuario
        string element;   // Elemento sobre el cual se interactuó
        uint256 timestamp; // Marca de tiempo de la interacción
        address user;     // Dirección del usuario que realizó la interacción
    }

    // Arreglo dinámico de interacciones
    Interaction[] public interactions;

    // Evento para cuando se registra una nueva interacción
    event InteractionLogged(address indexed user, string action, string element, uint256 timestamp);

    // Función para registrar una nueva interacción
    function logInteraction(string memory action, string memory element) public {
        require(bytes(action).length > 0, "La accion no puede estar vacia");
        require(bytes(element).length > 0, "El elemento no puede estar vacio");

        // Crear una nueva interacción y almacenarla
        interactions.push(Interaction({
            action: action,
            element: element,
            timestamp: block.timestamp,
            user: msg.sender // Registra la dirección del usuario que interactúa
        }));

        // Emitir un evento para que las dApps puedan escuchar
        emit InteractionLogged(msg.sender, action, element, block.timestamp);
    }

    // Obtener todas las interacciones
    function getInteractions() public view returns (Interaction[] memory) {
        return interactions;
    }

    // Obtener la cantidad de interacciones registradas
    function getInteractionsCount() public view returns (uint256) {
        return interactions.length;
    }
}
