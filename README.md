# IP to Location

![IP to Location App Screenshot](/ip-to-location.png)

A web application that displays address of given ip addresses. This app also detects whether a particular IP address is suspicious.

Built with Next.js and [IPstack API](https://ipstack.com/).

## Features

-   📍 Display the location of given IP addresses
-   📰 Check if a particular IP address is suspicious or not
-   🌐 Fetch location of multiple IP addresses with single API call

## Installation

To set up the IP to Location App project locally, follow these steps:

1. Clone the repository:

    ```
    git clone https://github.com/apilayer/ip-to-location-app.git
    ```

2. Navigate to the project directory:

    ```
    cd ip-to-location-app
    ```

3. Install the dependencies:

    ```
    npm install
    ```

4. Create a `.env.local` file in the root directory and add your API keys:

    ```
    IPSTACK_API_KEY=your_ipstack_api_key_here
    ```

5. Run the development server:

    ```
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. App will show the locations of provided IP addresses
2. Select a particular location block and see full address
3. Check Proxy, Crawler, Tor, Threat Level, and other important details

## Technologies Used

-   [Next.js](https://nextjs.org/)
-   [IPstack API](https://ipstack.com/) to convert IP addresses to location

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
