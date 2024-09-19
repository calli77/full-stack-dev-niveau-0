const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = 3000;
const uri = "mongodb://localhost:27017";
var cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('/news pour voir les dernières actualités');
});

async function getClient() {
    const client = new MongoClient(uri);
    return client.connect();
}

async function getCollection() {
    return getClient().then(client => {
        return client.db("project").collection("news");
    });
}

async function findAllNews() {
    let collection = await getCollection();
    return collection.find({}).toArray();
}

async function findNewsById(id) {
    let collection = await getCollection();
    console.log(`Recherche de l'actualité avec ID : ${id}`);
    let result = await collection.findOne({ id_actu: id });
    return result;
}

async function markNewsAsRead(id) {
    let collection = await getCollection();
    console.log(`Mise à jour de l'actualité avec ID : ${id}`);
    
    let result = await collection.updateOne(
        { id_actu: id },
        { $set: { read: true } } 
    );
    
    if (result.matchedCount === 0) {
        console.log(`Aucune actualité trouvée pour l'ID : ${id}`);
        return null;
    } else {
        console.log(`Actualité marquée comme lue avec succès pour l'ID : ${id}`);
        return result;
    }
}

async function initializeDatabase() {
    let collection = await getCollection();
    
    const count = await collection.countDocuments();
    if (count === 0) {
        console.log("La collection est vide. Insertion des données...");
        
        const newsItems = [
            { id_actu: 1, title: "La 100ème écoute un record pour cette entreprise", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque facil...", read: false },
            { id_actu: 2, title: "Nouvelles avancées dans la technologie de la batterie", content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...", read: false },
            { id_actu: 3, title: "Réduction des émissions de carbone dans le secteur industriel", content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...", read: false },
            { id_actu: 4, title: "Les tendances de la mode pour l'année 2024", content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...", read: false },
            { id_actu: 5, title: "Découverte d'une nouvelle exoplanète dans notre voisinage galactique", content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...", read: false }
        ];

        await collection.insertMany(newsItems);
        console.log("Données insérées avec succès.");
    } else {
        console.log("La collection n'est pas vide. Aucune insertion nécessaire.");
    }
}

app.get('/news', (req, res) => {
    findAllNews()
    .then(tasks => {
        console.log("Actualités trouvées :");
        res.json(tasks);
    })
    .catch(error => {
        console.error("Une erreur est survenue :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des actualités" });
    });
});

app.get('/get-news/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.params.id);
    findNewsById(Number(id))
    .then(news => {
        if (news) {
            console.log("Actualité trouvée :");
            res.json(news);
        } else {
            res.status(404).json({ error: "Actualité non trouvée" });
        }
    })
    .catch(error => {
        console.error("Une erreur est survenue :", error);
        res.status(500).json({ error: "Erreur lors de la récupération de l'actualité" });
    });
});

app.post('/news-read', (req, res) => {
    const id = req.body.id;
    markNewsAsRead(Number(id))
    .then(result => {
        if (result) {
            res.json({ success: true, message: "Actualité marquée comme lue." });
        } else {
            res.status(404).json({ error: "Actualité non trouvée." });
        }
    })
    .catch(error => {
        console.error("Erreur lors de la mise à jour de l'actualité :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'actualité." });
    });
});

initializeDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    })
    .catch(error => {
        console.error("Erreur lors de l'initialisation de la base de données :", error);
    });
