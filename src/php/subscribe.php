<?php
/**
 * Created by PhpStorm.
 * User: ermaldo
 * Date: 05.12.15
 * Time: 18:28
 *
 * This subcribtion.php file includes the mongo.php file in which an Instance($n), database($db->learningmongo)
 * and a collection($people) of MongoDb are defined/created. Here we have also included the index.html file, which will be the
 * clone of subscribtion.php by showing exactly the content of index.html.
 * The subscribtion.php  insert the given values from (subscribtion Modal) by the users into the database.
 *
 */

include('mongo.php'); /** path should be adjusted later on the server */
include('index.html');/** path should be adjusted later on the server */

/** Checking if the name-field is not blank */
if(isset($_POST['name']))
{
    /** if not blank we will insert the given values in the collection */
    $people->insert( array(
        "name" => $_POST['name'],
        "email" => $_POST['email']
    ));

    /** path should be adjusted later on the server */
    header("Location: /src/subscribtion.php");
}

/** @var  $cursor : dealing with the result. But i am not using it for now. Maybe it would be useful later. */
$cursor = $people->find(); //handling with result

?>


<!-- The modal that will be shown after saving data. This modal contains the count of Subscribers -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</head>
<body>

<div class="container">


    <!-- Modal -->
    <div class="modal fade" id="subModal" role="dialog">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h1 class="modal-title">The count of Subscribers</h1>
                </div>
                <div class="modal-body">
                    <h3><p id="subscribe">Subscriber(s): <?php echo $cursor->count($_GET['id'])?></p></h3>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $.ajax({
        url: 'subscribtion.php',
        dataType: 'text',
        success: function() {
            $("#subModal").modal();
        }
    });
</script>
</body>
</html>
