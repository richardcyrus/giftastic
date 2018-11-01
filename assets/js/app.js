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

(function ($) {
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
         * @type {{api_key: string, fmt: string, lang: string, limit: number, offset: number, rating: string, q: string|null}}
         */
        const queryData = {
            api_key: 'dc6zaTOxFJmzC',
            fmt: 'json',
            lang: 'en',
            limit: 10,
            offset: 0,
            rating: 'pg-13',
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
         * Remove all GIPHY images from the page.
         */
        const clearImages = function () {
            $('.image-set').empty();
        };

        /**
         * Create a new user provided topic button.
         *
         * @param el
         */
        const addUserTopic = function (el) {
            // Extract the user's text input.
            let providedTopic = el.val().trim();
            providedTopic = toTitleCase(providedTopic);

            // Create a new button with the text from the input
            // field.
            if (! topics.includes(providedTopic)) {

                displayTopicButton(createTopicButton(providedTopic));

                // To satisfy one of the homework requirements `;-)`
                topics.push(providedTopic);
            } // TODO: Show message and flash button when exists.

        };

        /**
         * Query the API for the specified term.
         *
         * @param search_term
         */
        const getFromAPI = function (search_term) {
            queryData.q = search_term;

            $.ajax({
                url: base_uri,
                data: queryData
            }).done((result) => {
                clearImages();
                createImages(result.data);
            });
        };

        /**
         * Using the information from the API query, build the image
         * tags for display on the page.
         *
         * @param giphyData
         */
        const createImages = function (giphyData) {
            giphyData.forEach((record) => {
                const image = $('<img/>')
                    .attr({
                        src: record.images.original_still.url,
                        'data-still': record.images.original_still.url,
                        'data-animate': record.images.original.url,
                        'data-state': 'still',
                        'data-rating': record.rating
                    }).addClass('gif');

                displayImages(image);
            });
        };

        /**
         * Add a completed image tag to the page.
         *
         * @param element
         */
        const displayImages = function (element) {
            $('.image-set').append(element);
        };

        /**
         * Check the current animation state of the element that was
         * clicked and make the appropriate adjustments.
         *
         * @param el
         */
        const changeState = function (el) {
            const currentState = $(el).attr('data-state');

            switch (currentState) {
                case 'still':
                    $(el).attr('src', $(el).attr('data-animate'));
                    $(el).attr('data-state', 'animate');
                    break;
                case 'animate':
                    $(el).attr('src', $(el).attr('data-still'));
                    $(el).attr('data-state', 'still');
                    break;
            }
        };

        /**
         * Register all event handlers for this application.
         */
        const registerEventHandlers = function () {
            /**
             * Handle the submission of the user's topic when they click
             * the submit button or press enter after typing into the
             * input box on the form.
             */
            $('.user-topic').on('submit', '.user__topic-form', function (e) {
                // Stop the page refresh on form submission.
                e.preventDefault();

                // Get the user's entry and dispatch the button creation.
                const el = $(this).find('[name=user_topic]');
                addUserTopic(el);

                // Clear the input box so the user can add more topics.
                el.val('');
            });

            /**
             * Initiate a query to the API when the user clicks on one
             * of the topic buttons (Including user created topic buttons).
             */
            $('.button-set').on('click', '.topic__button', function (e) {
                e.preventDefault();

                // Lookup the topic using GIPHY search API.
                getFromAPI($(this).attr('data-topic'));
            });

            /**
             * Animate the Gif when the user clicks on the image, and
             * stop the animation when they click the image again.
             */
            $('.image-set').on('click', '.gif', function () {
                changeState($(this));
            });
        };

        /**
         * Setup the application.
         */
        const init = function () {
            buildInitialTopicButtons();
            buildUserTopicsForm();
            registerEventHandlers();
        };

        /**
         * Expose the public API for using this module.
         */
        return {
            setup: init
        };

    })();

    GifTastic.setup();
})(jQuery);
