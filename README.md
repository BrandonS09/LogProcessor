# Log Processor
A website that accepts a log file and then looks for certain job ids and patterns to spit out a refined log
# Built with
- [Django](https://www.djangoproject.com/) for the backend 
- [React](https://react.dev/) for the frontend
- [Vite](https://vitejs.dev/) for packaging
- Hosted with [Vercel](https://vercel.com/)
# How to use
1. Upload your file
2. Type in the JobID your looking for(if you have one)
3. Type in any patterns your looking for
4. Run and download the processed log files!
# How to run locally
Upon cloning the repository, go to ```backend``` and run ```python manage.py runserver``` then go to ```frontend``` and run ```npm run dev```. In ```frontend``` change any link that contains ```backend-log-processor.vercel.app``` with ```localhost:5173```
