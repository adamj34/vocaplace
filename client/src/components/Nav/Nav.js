

export function Nav() {
    return (
        <nav id ="Nav">
            <div id='left'>
                <img alt="logo"></img>
            </div>
            <div id='right'>
                <button className="button">Log in</button>
                <p>or</p>
                <button className="button">Create account</button>
            </div>
        </nav>
    )
}