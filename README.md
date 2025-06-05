# Mojo Memory Whisper

A personalized AI-powered daily feed that curates content based on your preferences, interests, and mood. This application uses OpenAI's GPT and DALL-E models to generate unique, tailored content for each user.

## 🌟 Features

### Personalized Content Generation

- **News Feed**: Tech updates and industry insights based on your interests
- **Music Recommendations**: Playlists and artist discoveries matching your taste
- **Food Inspiration**: Recipes and restaurant suggestions aligned with your preferences
- **Wellness Tips**: Personalized wellness advice and mindfulness exercises
- **Video Content**: Movie and show recommendations from your streaming services
- **Social Connections**: Networking opportunities and social interaction tips
- **Travel Ideas**: Travel inspiration and local exploration suggestions
- **Surprise Discoveries**: Random, delightful content based on your interests

### Smart Features

- **Content Caching**: Efficient content storage to prevent unnecessary regeneration
- **Image Generation**: AI-generated images for each content piece
- **Mood-Based Content**: Content adapts to your current mood
- **Journal Integration**: Save interesting content to your personal journal
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mojo-memory-whisper.git
cd mojo-memory-whisper
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5 Turbo, DALL-E
- **State Management**: React Hooks
- **UI Components**: Custom components with shadcn/ui

## 📱 Features in Detail

### Content Generation

- Each tab generates unique content based on user preferences
- Content is cached for 1 hour to improve performance
- Images are generated using DALL-E for visual appeal
- Content updates based on user's current mood

### User Preferences

- Personality type
- Interests and hobbies
- Music and video preferences
- Food and cuisine preferences
- Travel style and destinations
- Social and professional goals

### Content Categories

1. **News**

   - Tech updates
   - Industry insights
   - Personalized news feed

2. **Music**

   - Playlist recommendations
   - Artist discoveries
   - Mood-based suggestions

3. **Food**

   - Recipe recommendations
   - Restaurant suggestions
   - Dietary preference matching

4. **Wellness**

   - Wellness tips
   - Mindfulness exercises
   - Health recommendations

5. **Video**

   - Movie recommendations
   - Show suggestions
   - Streaming content

6. **People**

   - Social connection tips
   - Networking opportunities
   - Relationship advice

7. **Travel**

   - Destination suggestions
   - Local exploration ideas
   - Travel planning tips

8. **Surprise**
   - Random discoveries
   - Fun challenges
   - Unexpected recommendations

## 🔧 Configuration

### Environment Variables

```env
OPENAI_API_KEY=your_api_key_here
```

### Content Cache Settings

- Default cache duration: 1 hour
- Cache can be manually refreshed
- Cache is section-specific

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT and DALL-E APIs
- The Next.js team for the amazing framework
- All contributors who have helped shape this project

## 📞 Support

For support, email support@mojomemorywhisper.com or open an issue in the repository.

## 🔄 Updates

Stay tuned for upcoming features:

- User authentication
- Content sharing
- Advanced personalization
- Mobile app version
- More AI-powered features
