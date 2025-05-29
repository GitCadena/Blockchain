const Web3 = require('web3').default;
const router = require('express').Router();

// Configurar Web3 para conectarse a la blockchain local
const web3 = new Web3('http://127.0.0.1:8545');

// ABI del contrato y dirección del contrato desplegado en Remix
const contractABI = [ [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "action",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "element",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "InteractionLogged",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getInteractions",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "action",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "element",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					}
				],
				"internalType": "struct UserInteraction.Interaction[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getInteractionsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "interactions",
		"outputs": [
			{
				"internalType": "string",
				"name": "action",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "element",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "action",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "element",
				"type": "string"
			}
		],
		"name": "logInteraction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]];
const contractAddress = '0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005';

// Instanciar el contrato
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Función para registrar interacciones
router.post('/logs', async (req, res) => {
    const { action, element } = req.body;

    if (!action || !element) {
        return res.status(400).send({ message: 'Action and element are required.' });
    }

    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            return res.status(500).send({ message: 'No se encontraron cuentas disponibles.' });
        }

        // Ajustar el gas si es necesario
        const result = await contract.methods.logInteraction(action, element)
            .send({ from: accounts[0], gas: 3000000 });

        console.log('Interacción registrada en la blockchain:', result);
        res.status(200).send({ message: 'Interacción registrada y bloque creado en la blockchain' });
    } catch (error) {
        console.error('Error al interactuar con el contrato:', error);
        res.status(500).send({ message: 'Error al registrar la interacción en la blockchain' });
    }
});

module.exports = router;
