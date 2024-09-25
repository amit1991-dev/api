const express = require("express");
const router = express.Router();

const characterRoute = require('character/index');
const postsRoute = require('posts/index');
const feedRoute = require('feed/index');
const eventsRoute = require('events/index');
const newsRoute = require('news/index');
const chatRoute = require('chat/index');


router.use('character/',characterRoute);
router.use('posts/',postsRoute);
router.use('feed/',feedRoute);
router.use('news/',newsRoute);
router.use('events/',eventsRoute);
router.use('chat/',chatRoute);

module.exports=router;