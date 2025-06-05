
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Gift, MessageCircle, Camera, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PeopleMemoriesProps {
  userData: any;
}

export const PeopleMemories = ({ userData }: PeopleMemoriesProps) => {
  const [people, setPeople] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    relationship: '',
    birthday: '',
    notes: '',
    favoriteMemory: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    initializePeople();
  }, [userData]);

  const initializePeople = () => {
    if (userData.favoritePeople) {
      const peopleNames = userData.favoritePeople.split(',').map((name: string) => name.trim());
      const initialPeople = peopleNames.map((name: string, index: number) => ({
        id: index + 1,
        name,
        relationship: 'Important Person',
        birthday: '',
        notes: `One of ${userData.name}'s favorite people`,
        favoriteMemory: '',
        lastContact: new Date().toISOString(),
        upcomingBirthday: false
      }));
      setPeople(initialPeople);
    }
  };

  const addPerson = () => {
    if (!newPerson.name) return;
    
    const person = {
      id: people.length + 1,
      ...newPerson,
      lastContact: new Date().toISOString(),
      upcomingBirthday: checkUpcomingBirthday(newPerson.birthday)
    };
    
    setPeople([...people, person]);
    setNewPerson({ name: '', relationship: '', birthday: '', notes: '', favoriteMemory: '' });
    setShowAddForm(false);
    
    toast({
      title: `Added ${person.name} to your circle! 💕`,
      description: "They're now part of your MeMojo family.",
    });
  };

  const checkUpcomingBirthday = (birthday: string) => {
    if (!birthday) return false;
    const today = new Date();
    const birthDate = new Date(birthday);
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  };

  const generateMessage = (person: any) => {
    const messages = [
      `Hey ${person.name}! Hope you're having an amazing day 🌟`,
      `Thinking of you, ${person.name}! Let's catch up soon ☕`,
      `${person.name}, you're awesome! Just wanted you to know 💫`,
      `Missing our chats, ${person.name}! How have you been? 🤗`
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    navigator.clipboard.writeText(message);
    
    toast({
      title: "Message copied! 📱",
      description: `Sweet message for ${person.name} is ready to send.`,
    });
  };

  const upcomingBirthdays = people.filter(person => person.upcomingBirthday);

  return (
    <div className="space-y-6">
      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <Card className="glass-effect border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center text-pink-600">
              <Gift className="w-5 h-5 mr-2" />
              Upcoming Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBirthdays.map(person => (
                <div key={person.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.birthday}</p>
                  </div>
                  <Button size="sm" onClick={() => generateMessage(person)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Wishes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* People Grid */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          Your People
        </h3>
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Someone
        </Button>
      </div>

      {/* Add Person Form */}
      {showAddForm && (
        <Card className="glass-effect border-green-200">
          <CardHeader>
            <CardTitle>Add Someone Special</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
              />
              <Input
                placeholder="Relationship (e.g., Best Friend, Mom)"
                value={newPerson.relationship}
                onChange={(e) => setNewPerson({...newPerson, relationship: e.target.value})}
              />
            </div>
            <Input
              type="date"
              placeholder="Birthday"
              value={newPerson.birthday}
              onChange={(e) => setNewPerson({...newPerson, birthday: e.target.value})}
            />
            <Textarea
              placeholder="What makes them special?"
              value={newPerson.notes}
              onChange={(e) => setNewPerson({...newPerson, notes: e.target.value})}
            />
            <div className="flex space-x-2">
              <Button onClick={addPerson}>Add Person</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* People Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {people.map(person => (
          <Card key={person.id} className="glass-effect">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{person.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{person.relationship}</p>
                </div>
                {person.upcomingBirthday && (
                  <Badge variant="secondary" className="bg-pink-100 text-pink-600">
                    <Gift className="w-3 h-3 mr-1" />
                    Birthday Soon
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {person.notes && (
                <p className="text-sm text-muted-foreground mb-3">{person.notes}</p>
              )}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateMessage(person)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Quick Message
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Memory
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
