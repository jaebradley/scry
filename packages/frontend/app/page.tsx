'use client';

import { navigateToPropertiesPage } from  './actions';

export default function Home() {

    return (
        <main>
            <form action={navigateToPropertiesPage}>
                <input name="location" type="text" placeholder="Specify a location to search for properties..."/>
                <button type="submit">Search</button>
            </form>
        </main>
    );
}
