
const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Options = require('../models/options.js');


module.exports = function(app, db) {

    app.get('/api/options/', ctr.isLoggedIn, //ctr.requireAdmin,
        function(req, res) {
            let userId = req.user.id;
            const details = { '_id': userId };

            Options.findOne(details, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    if(item != undefined)
                        res.send(item);
                    else
                        res.status(501).end();
                }
            });
        });


    app.post('/api/options/', ctr.isLoggedIn, //ctr.requireAdmin,
        function(req, res) {
            let userId = req.user.id;
            const req_receiveFcm = req.body.receiveFcm;

            console.log('body.receive' + req_receiveFcm);

            const model = {
                $set: {
                    'receiveFcm': req_receiveFcm
                }
            };
            const query = {
                '_id': userId
            };


            Options.update(query, model, { upsert: true },
                function(err, data){
                    if (err){
                        console.log(err);
                    }else{
                        console.log('created');
                        res.send(data);
                    }
                });
        });


};