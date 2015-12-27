<?php
/**
 * Created by PhpStorm.
 * User: ermaldo
 * Date: 05.12.15
 * Time: 20:17
 * Change Db-Nmae, Collection name as you like
 */


        $n = new MongoClient(); // Creating an Instance of MongoDB
        $db = $n->learningmongo; // Creating the database learningmongo
        $people = $db->people; // Creating the Collection People