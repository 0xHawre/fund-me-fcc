window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        alert('Please install MetaMask to use this dApp!');
    }

    const contractABI = []; // Replace with the ABI of your contract
    const contractAddress = ""; // Replace with the address of your deployed contract
    const fundMe = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById('fundBtn').addEventListener('click', async () => {
        const amount = document.getElementById('amount').value;
        const accounts = await web3.eth.getAccounts();
        const weiAmount = web3.utils.toWei(amount, 'ether');
        
        await fundMe.methods.fund().send({ from: accounts[0], value: weiAmount });
        updateTotalFunds();
    });

    async function updateTotalFunds() {
        const totalFunds = await fundMe.methods.getTotalFunds().call();
        const totalFundsEth = web3.utils.fromWei(totalFunds, 'ether');
        document.getElementById('totalFunds').innerText = `Total Funds: ${totalFundsEth} ETH`;
    }

    updateTotalFunds();
});
