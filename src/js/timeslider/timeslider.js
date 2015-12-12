
                                        // helper function for Timeslider
                                        function timestamp(str) {
                                            return new Date(str).getTime();
                                        }


                                        // noUiSlider -> for selecting a timespan for displaying changes
                                        var dateSlider = document.getElementById('slider-date');
                                        noUiSlider.create(dateSlider, {
                                            connect: true,
                                            range: {
                                                // Range is from where the project started to the current date
                                                min: timestamp('2015-11-15'),
                                                max: new Date().getTime()
                                            },
                                            // Steps of one month
                                            // (365.25d/y ) / 12 = 30,4375
                                            step: 30.4375 * 24 * 60 * 60 * 1000,
                                            // Two more timestamps indicate the handle starting positions.
                                            start: [timestamp('2015-11-15'), new Date().getTime()],
                                        });
                                        // Create a list of monthnames.
                                        var months = [
                                            "January", "February", "March",
                                            "April", "May", "June", "July",
                                            "August", "September", "October",
                                            "November", "December"
                                        ];
                                        // Create a string representation of the date.
                                        function formatDate(date) {
                                            return  months[date.getMonth()] + " " +
                                                    date.getFullYear();
                                        }


                                        // Span Elements -> The start and end values are displayed there
                                        var dateValues = [
                                            document.getElementById('event-start'),
                                            document.getElementById('event-end')
                                        ];
                                        // Update Handler -> Updates the span elements
                                        dateSlider.noUiSlider.on('update', function (values, handle) {
                                            dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
                                        });