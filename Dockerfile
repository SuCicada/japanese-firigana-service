FROM node:18-alpine as build

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN npm install && npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist/ .
# Make port 80 available to the world outside this container
EXPOSE 41401

# Run app.py when the container launches
CMD ["node", "index"]
