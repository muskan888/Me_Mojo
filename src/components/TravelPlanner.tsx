
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plane, Calendar, Clock, Mountain, Camera, Coffee } from 'lucide-react';

interface TravelPlannerProps {
  userData: any;
}

export const TravelPlanner = ({ userData }: TravelPlannerProps) => {
  const [destination, setDestination] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTravelPlan = async () => {
    if (!destination) return;
    
    setIsGenerating(true);
    
    // Mock AI travel planning
    setTimeout(() => {
      const mockPlan = {
        destination,
        duration: '3 days',
        style: userData.travelStyle || 'Balanced',
        budget: 'Mid-range',
        days: [
          {
            day: 1,
            title: 'Arrival & Exploration',
            activities: [
              { time: '10:00 AM', activity: 'Check into accommodation', icon: MapPin },
              { time: '12:00 PM', activity: 'Local food tour - try signature dishes', icon: Coffee },
              { time: '3:00 PM', activity: 'Walking tour of historic district', icon: Camera },
              { time: '7:00 PM', activity: 'Sunset viewing at best local spot', icon: Mountain }
            ]
          },
          {
            day: 2,
            title: 'Culture & Adventure',
            activities: [
              { time: '9:00 AM', activity: 'Visit main cultural attraction', icon: Camera },
              { time: '1:00 PM', activity: 'Traditional lunch experience', icon: Coffee },
              { time: '3:30 PM', activity: 'Adventure activity (hiking/biking)', icon: Mountain },
              { time: '8:00 PM', activity: 'Local nightlife experience', icon: MapPin }
            ]
          },
          {
            day: 3,
            title: 'Relaxation & Departure',
            activities: [
              { time: '10:00 AM', activity: 'Morning at local market/shops', icon: Coffee },
              { time: '1:00 PM', activity: 'Relaxing lunch with a view', icon: Mountain },
              { time: '4:00 PM', activity: 'Final photos and memories', icon: Camera },
              { time: '7:00 PM', activity: 'Departure preparation', icon: Plane }
            ]
          }
        ],
        tips: [
          'Pack comfortable walking shoes',
          'Download offline maps',
          'Try the local specialty dish',
          'Keep some cash for small vendors'
        ],
        personalizedNote: userData.travelStyle === 'Backpacker' ? 
          'Perfect for your backpacker spirit - lots of local experiences!' :
          'Curated with your travel preferences in mind ✨'
      };
      
      setPlan(mockPlan);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h3 className="text-xl font-semibold flex items-center">
          <Plane className="w-5 h-5 mr-2" />
          Dream Trip Planner
        </h3>
      </div>

      {!plan ? (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Where would you like to go?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter a destination (e.g., Paris, Tokyo, Bali)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateTravelPlan()}
            />
            <Button 
              onClick={generateTravelPlan}
              disabled={!destination || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Planning your perfect trip...
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4 mr-2" />
                  Plan My 3-Day Trip
                </>
              )}
            </Button>
            {userData.travelStyle && (
              <p className="text-sm text-muted-foreground text-center">
                Planning for a {userData.travelStyle.toLowerCase()} style trip
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Trip Overview */}
          <Card className="glass-effect border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {plan.destination} - {plan.duration}
              </CardTitle>
              <p className="text-muted-foreground">{plan.personalizedNote}</p>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Badge variant="outline">{plan.style} Style</Badge>
                <Badge variant="outline">{plan.budget}</Badge>
                <Badge variant="outline">{plan.duration}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Daily Itinerary */}
          {plan.days.map((day: any) => (
            <Card key={day.day} className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">
                  Day {day.day}: {day.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {day.activities.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-secondary/20 rounded-lg">
                      <div className="p-2 rounded-full bg-primary/10">
                        <activity.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-primary">{activity.time}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm">{activity.activity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Travel Tips */}
          <Card className="glass-effect border-green-200">
            <CardHeader>
              <CardTitle className="text-lg">Travel Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <Button onClick={() => setPlan(null)} variant="outline">
              <Plane className="w-4 h-4 mr-2" />
              Plan Another Trip
            </Button>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Save to Calendar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
