const fetch = require('node-fetch');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const TOKEN = 'TOK3N'; 

async function createTeam(name, callback) {
    try {
        const response = await fetch('https://canary.discord.com/api/v9/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${TOKEN}`
            },
            body: JSON.stringify({ name: name })
        });
        const body = await response.json();
        console.log(`Team créée : ${body.name} (${body.id})`);
        callback(body.id);
    } catch (error) {
  
    }
}

async function sendRequest(n, name) {
    let count = 0;

    async function send(teamId) {
        try {
            const response = await fetch('https://discord.com/api/v9/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${TOKEN}`,
                    'X-Track': 'eyJvcyI6IkxpbnV4IiwiYnJvd3NlciI6IkNocm9tZSIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJmci1GUiIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyMy4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTIzLjAuMC4wIiwib3NfdmVyc2lvbiI6IiIsInJlZmVycmVyIjoiIiwicmVmZXJyaW5nX2RvbWFpbiI6IiIsInJlZmVycmVyX2N1cnJlbnQiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6Ind3dy5nb29nbGUuY29tIiwic2VhcmNoX2VuZ2luZV9jdXJyZW50IjoiZ29vZ2xlIiwicmVsZWFzZV9jaGFubmVsIjoiY2FuYXJ5IiwiY2xpZW50X2J1aWxkX251bWJlciI6MzkwODYsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9'
                },
                body: JSON.stringify({
                    name: name,
                    team_id: teamId
                })
            });
            const body = await response.json();

            if (response.status === 429  {
                console.log(`Rate limited. Retrying after ${body.retry_after / 1000} seconds...`);
                setTimeout(send, body.retry_after, teamId);
                return;
            }

            if (response.status === 201) {
                console.log(`Bot créé : ${body.name}#${body.bot.discriminator} (${body.id})`);
            } else {
                console.log(`Erreur : ${response.status} - ${body.message}`);
            }

            count++;
            if (count < n) {
                send(teamId);
            }
        } catch (error) {
          
        }
    }

    createTeam('uhq', send);
}

function main() {
    rl.question('Entrez le nombre de bots à créer : ', (count) => {
        rl.question('Entrez le nom des bots : ', (name) => {
            sendRequest(parseInt(count), name);
            rl.close();
        });
    });
}

main();
