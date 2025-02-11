import React from 'react';
import englishService, { Word } from 'services/englishService';

export default function English() {

    const [english, setEnglish] = React.useState<Word[] | null>(null);
    const [welcome, setWelcome] = React.useState<{message: string} | null>(null);

    React.useEffect(() => {
        englishService.getEnglish().then(setEnglish);
        englishService.getWelcome().then(setWelcome);
    }, []);

    return <div>
        {welcome?.message}
        <br />
        {english?.map(item => item.Text).join(', ')}
    </div>;

}