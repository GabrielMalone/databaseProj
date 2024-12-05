#include <SFML/Graphics.hpp>

int main()
{
    // Create a window
    sf::RenderWindow window(sf::VideoMode(800, 600), "SFML Graphics Example");

    // Create a circle
    sf::CircleShape circle(50);
    circle.setFillColor(sf::Color::Green);
    circle.setPosition(375, 275); // Position in the center of the window

    // Game loop
    while (window.isOpen())
    {
        // Process events
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        // Clear the window with a color
        window.clear(sf::Color::Black);

        // Draw the circle
        window.draw(circle);

        // Display the content
        window.display();
    }

    return 0;
}