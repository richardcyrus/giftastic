/* global jQuery */

/**
 * GifTastic
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus <richard.cyrus@rcyrus.com>
 *
 * Create a list of topics (done)
 * Using JavaScript, display click-able topics on the HTML page.
 * Create a form to collect additional terms from the users.
 * When the form is submitted, add the user provided terms to the list
 *  of topic buttons on the page.
 * When a topic is clicked, get 10 images from GIPHY.
 * Display the image rating below the image.
 * When the user clicks on an image, the image should begin its animation.
 * When the user clicks on the image a second time, the animation should
 *  stop.
 */

(function ($, window) {
    const GifTastic = (function () {
        "use strict";

        /**
         * The base URI for a GIPHY API search request.
         * @type {string}
         */
        const base_uri = 'https://api.giphy.com/v1/gifs/search';

        /**
         * The data object that's passed to the jQuery ajax call. Using this
         * allows for jQuery to automatically handle the url-encoding of
         * characters for the request.
         *
         * @type {{api_key: string, fmt: string, lang: string, limit: number, offset: number, q: string|null}}
         */
        const data = {
            api_key: 'dc6zaTOxFJmzC',
            fmt: 'json',
            lang: 'en',
            limit: 10,
            offset: 0,
            q: null
        };

        /**
         * The initial list of topics that will be displayed on the screen.
         *
         * @type {string[]}
         */
        const topics = [
            'Cat',
            'Confused',
            'Dr Who',
            'Empire',
            'Funny',
            'GIPHY Studios',
            'Good Luck',
            'Hamilton',
            'Happy',
            'Kitten',
            'Love',
            'Madea',
            'No',
            'Puppy',
            'Running Late',
            'Shameless',
            'Sherlock',
            'Sudden Realization',
            'Supernatural',
            'Thank You',
            'Tired',
            'Tony Awards',
            'Whatever',
        ];

        /**
         * Convert a string into Title Case.
         *
         * @param str
         * @returns {string}
         */
        const toTitleCase = function (str) {
            str = str.toLowerCase().split(' ');

            let i = 0;

            for (; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
            }

            return str.join(' ');
        };

        /**
         * Create a HTML button using jQuery.
         *
         * @param topic
         * @returns {*}
         */
        const createTopicButton = function (topic) {
            return $('<button/>')
                .addClass('topic__button')
                .attr('data-topic', topic.toLowerCase())
                .text(topic);
        };

        /**
         * Append a HTML button to the web page.
         *
         * @param button
         */
        const displayTopicButton = function (button) {
            $('.button-set').append(button);
        };

        /**
         * When initializing the site, create a series of buttons
         * on the page based on the default topic list.
         */
        const buildInitialTopicButtons = function () {
            topics.forEach((topic) => {
                displayTopicButton(createTopicButton(topic));
            });
        };

        /**
         * Create a form for the user to add their own topics.
         */
        const buildUserTopicsForm = function () {
            const userTopicInput = $('<input/>')
                .addClass('form-control')
                .attr({
                    type: 'text',
                    name: 'user_topic',
                    title: 'user_topic',
                    id: 'user-topic',
                    required: true
                });

            const userTopicSubmit = $('<input/>')
                .addClass('btn btn-primary')
                .attr({
                    type: 'submit',
                    value: 'Add Topic'
                });

            const formGroup = $('<div/>')
                .addClass('form-group user__topic-form-group')
                .append(userTopicInput, userTopicSubmit);

            const userTopicForm = $('<form/>')
                .addClass('user__topic-form')
                .attr({method: 'POST', action: '#'})
                .append(formGroup);

            $('.user-topic').append(userTopicForm);
        };

        /**
         * Handle the submission of the user's topic when they click
         * the submit button or press enter after typing into the
         * input box on the form.
         */
        const addUserTopic = function () {
            $('.user-topic').on('submit', '.user__topic-form', function (e) {
                // Stop the page refresh on form submission.
                e.preventDefault();

                // Get the element with the user's input.
                const el = $(this).find('[name=user_topic]');

                // Extract the user's text input.
                const providedTopic = el.val().trim();

                // Create a new button with the text from the input
                // field. (TODO: Make sure topic isn't already there!)
                displayTopicButton(
                    createTopicButton(
                        toTitleCase(providedTopic)
                    )
                );

                // Clear the input box so they can add more topics.
                el.val('');
            });
        };

        const init = function () {
            buildInitialTopicButtons();
            buildUserTopicsForm();
            addUserTopic();
        };

        return {
            setup: init
        };

    })();

    GifTastic.setup();
})(jQuery, window);
