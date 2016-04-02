(function () {

  $(document).ready(function () {
    'use strict';

    $('.ui.form').form({
      fields: {
        username: {
          identifier: 'username',
          rules:      [
            {
              type:   'empty',
              prompt: 'Please enter your username'
            }
          ]
        },
        password: {
          identifier: 'password',
          rules:      [
            {
              type:   'empty',
              prompt: 'Please enter your password'
            },
            {
              type:   'length[6]',
              prompt: 'Your password must be at least 6 characters'
            }
          ]
        }
      }
    });


    // Closing
    $('.message .close')
      .on('click', function () {
        $(this)
          .closest('.message')
          .transition('fade');
      });

  });

}());
