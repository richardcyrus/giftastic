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
            api_key: 'CKhFdi5258nuZ8Ph7LauVc0hUXQSPG8X',
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
         * The container for the `Add Topic` form.
         *
         * @type {*|HTMLElement}
         */
        const userTopicCont = $('.sidebar__form');

        /**
         * The container for the topic buttons.
         *
         * @type {*|HTMLElement}
         */
        const topicButtonCont = $('.topic__set');

        /**
         * The container for the gif images.
         *
         * @type {*|HTMLElement}
         */
        const imageCont = $('.image-set');

        /**
         * Display the title of the selected topic.
         *
         * @type {*|HTMLElement}
         */
        const topicTitle = $('.topic__title');

        /**
         * The target for toggling the display of the topic selected.
         *
         * @type {*|HTMLElement}
         */
        const titleCont = $('.topic__title-container');

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
                .addClass('btn btn-outline-primary topic__button mb-2 mr-2')
                .attr('data-topic', topic.toLowerCase())
                .text(topic);
        };

        /**
         * Append a HTML button to the web page.
         *
         * @param button
         */
        const displayTopicButton = function (button) {
            topicButtonCont.append(button);
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
                .addClass('form-control mb-2 border-dark')
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

            userTopicCont.append(userTopicForm);
        };

        /**
         * Remove all GIPHY images from the page.
         */
        const clearImages = function () {
            imageCont.empty();
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
            if (!topics.includes(providedTopic)) {

                displayTopicButton(createTopicButton(providedTopic));

                // To satisfy one of the homework requirements `;-)`
                topics.push(providedTopic);
            } else {
                showAlert(
                    `»${providedTopic}« is already in the list of topic buttons!`,
                    'info'
                );
            }
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
                const data = result.data;

                if (data.length === 0) {
                    const meta = result.meta;
                    const pages = result.pagination;

                    if (meta.status === 200 && pages.total_count === 0) {
                        showAlert('Sorry, there were no results for the chosen topic.');
                    }

                    // Quit now if there isn't anything in the result
                    // set. Does not clear the existing images when
                    // the query returned no data.
                    return;
                }

                clearImages();
                createImages(data);
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
                        'data-animate': record.images.original.url,
                        'data-rating': record.rating,
                        'data-state': 'still',
                        'data-still': record.images.original_still.url,
                        alt: record.title,
                        src: record.images.original_still.url
                    }).addClass('card-img-top gif');

                displayImages(image);
            });
        };

        /**
         * Add a completed image tag to the page.
         *
         * @param image
         */
        const displayImages = function (image) {

            const rating = $('<div/>')
                .addClass('card-text').text(
                    `Rating: ${$(image).attr('data-rating').toUpperCase()}`
                );

            const caption = $('<div/>')
                .addClass('card-body').append(rating);

            const card = $('<div/>')
                .addClass('card d-inline-block border-dark text-white bg-secondary')
                .append(image, caption);

            imageCont.append(card);
            titleCont.removeClass('d-none').addClass('d-flex')
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
         * Display a message on the screen to tell the user something.
         *
         * @param message
         * @param level
         */
        const showAlert = function (message, level = 'danger') {

            const levels = [
                'primary',
                'secondary',
                'success',
                'danger',
                'warning',
                'info',
                'light',
                'dark'
            ];

            if (!levels.includes(level)) {
                level = 'warning';
            }

            const closeSymbol = $('<span/>')
                .attr('aria-hidden', 'true')
                .html('&times;');

            const button = $('<button/>')
                .addClass('close')
                .attr({
                    'data-dismiss': 'alert',
                    'aria-label': 'Close'
                }).append(closeSymbol);

            const alert = $('<div/>')
                .addClass(`alert alert-${level} alert-dismissible fade show`)
                .attr('role', 'alert')
                .append(message, button);

            topicButtonCont.append(alert);
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
            userTopicCont.on('submit', '.user__topic-form', function (e) {
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
            topicButtonCont.on('click', '.topic__button', function (e) {
                e.preventDefault();

                // Set the topic title on the page.
                topicTitle.text($(this).text());

                // Lookup the topic using GIPHY search API.
                getFromAPI($(this).attr('data-topic'));
            });

            /**
             * Animate the Gif when the user clicks on the image, and
             * stop the animation when they click the image again.
             */
            imageCont.on('click', '.gif', function () {
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
