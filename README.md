1. Build service: npm run build
2. Launch service: npm run start
 
To stop service simply type: npm run stop

Server has very basic end to end and coverage report.
To run tests, go to hangman-server folder and type: 

npm run env:testing coverage

Once service starts simply navigate to docker machine ip (usually http://192.168.99.100/)
Gamepage: http://192.168.99.100/
Management page: http://192.168.99.100/#/management
API: http://192.168.99.100/api
API docs: http://192.168.99.100/api/docs

Notes:
Needs more tests
Word should be hidden from server payload
Should have some sort of auth for game list
Pagination support
