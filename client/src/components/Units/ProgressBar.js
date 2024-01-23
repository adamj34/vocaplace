
function ProgressBarRoundFunction(n) {
    if (n == 0) {
        return n
    } else {
        return Math.max(n, 5)
    }
}


export default function ProgressBar(p) {
    return (
        <div id='ProgressBar'>
            <div id='container'>
                <div id='bar' style={{ width: `${ProgressBarRoundFunction(p.completion)}%`}}>
                    <p>{p.completion}% Completed</p>
                </div>
            </div>
        </div>
    )
}