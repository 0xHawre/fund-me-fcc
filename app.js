const contractABI = [...]; // Add your contract ABI here
const contractAddress = '..'; // Add your contract address here

let contract;
let userAddress;

async function init() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = (await web3.eth.getAccounts())[0];
            document.getElementById('userAddress').textContent = userAddress;

            const userBalanceWei = await web3.eth.getBalance(userAddress);
            const userBalance = web3.utils.fromWei(userBalanceWei, 'ether');
            document.getElementById('userBalance').textContent = userBalance;

            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById('contractAddress').textContent = contractAddress;

            const contractBalanceWei = await contract.methods.getContractBalance().call();
            const contractBalance = web3.utils.fromWei(contractBalanceWei, 'ether');
            document.getElementById('contractBalance').textContent = contractBalance;

            document.getElementById('fundForm').addEventListener('submit', fundContract);
            document.getElementById('withdrawButton').addEventListener('click', withdrawFunds);
        } catch (error) {
            console.error('User denied account access');
        }
    } else {
        console.error('No web3 provider detected');
    }
}

async function fundContract(event) {
    event.preventDefault();
    const fundAmount = document.getElementById('fundAmount').value;
    const fundAmountWei = web3.utils.toWei(fundAmount, 'ether');

    await contract.methods.fund().send({ from: userAddress, value: fundAmountWei });

    // Update user and contract balances
    const userBalanceWei = await web3.eth.getBalance(userAddress);
    const userBalance = web3.utils.fromWei(userBalanceWei, 'ether');
    document.getElementById('userBalance').textContent = userBalance;

    const contractBalanceWei = await contract.methods.getContractBalance().call();
    const contractBalance = web3.utils.fromWei(contractBalanceWei, 'ether');
    document.getElementById('contractBalance').textContent = contractBalance;
}

async function withdrawFunds() {
    await contract.methods.withdraw().send({ from: userAddress });

    // Update user and contract balances
    const userBalanceWei = await web3.eth.getBalance(userAddress);
    const userBalance = web3.utils.fromWei(userBalanceWei, 'ether');
    document.getElementById('userBalance').textContent = userBalance;

    const contractBalanceWei = await contract.methods.getContractBalance().call();
    const contractBalance = web3.utils.fromWei(contractBalanceWei, 'ether');
    document.getElementById('contractBalance').textContent = contractBalance;
}

window.addEventListener('load', init);
