'use client';

import {navigateToPropertiesPage} from './actions';

export default function Home() {

    return (
        <main style={{width: '100%', height: '100%'}}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <form action={navigateToPropertiesPage}>
                    <input style={{width: '30rem', marginRight: '1rem'}} name="location" type="text"
                           placeholder="Specify a location to search for properties..."/>
                    <button type="submit">🔍</button>
                </form>
            </div>
        </main>
    );
}
