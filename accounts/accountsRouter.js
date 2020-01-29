const express = require('express');
const router = express.Router();
const db = require('../data/dbConfig');

router.get('/', async (req, res) => {
    try {
        const accounts = await db('accounts');
        res.status(200).json(accounts);
    } catch(err) {
        res.status(500).json({message: 'Error retrieving accounts!'});
    }    
});

router.post('/', async (req, res) => {
    const account = req.body;
    if(!req.body.name || !req.body.budget) {
        res.status(400).json({message: 'Please provide a name and budget'});
    }
    try {
        const [numTotalAccounts] = await db('accounts').insert(req.body);
        res.status(201).json({numberAccounts: numTotalAccounts});
    } catch(err) {
        res.status(500).json({message: 'Error creating account!'});    
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const [account] = await db('accounts').where('id', id);
        console.log(account)
        if(!account) {
            res.status(404).json({message: `Unable to find account with id#${id}`});
        } else {
            res.status(200).json(account);
        }
    } catch(err) {
        res.status(500).json({message: 'Error retrieving account!'});       
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const updates = req.body;
    if(!updates.name && !updates.budget) {
        res.status(400).json({message: 'Please provide a name or a budget field.'});
    }
    try {
        const updatedRecords = await db('accounts').where('id', id).update(updates);
        res.status(200).json({recordsUpdated: updatedRecords});
    } catch(err) {
        res.status(500).json({message: 'Error updating the account!'});      
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const deletedRows = await db('accounts').where('id', id).del();
        if(deletedRows === 0) {
            res.status(404).json({message: `Account not found with id#${id}`})
        } else {
            res.status(200).json({rowsDeleted: deletedRows});
        }
    } catch(err) {
        res.status(500).json({message: 'Error deleting the account!'});
    }
});

module.exports = router;