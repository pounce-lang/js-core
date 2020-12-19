
// 1 3 a [+] dip
var typeResolutinProgression =
[
    [
        "NUMBER",
        "NUMBER",
        "STRING", 
        [{in:["NUMBER", "NUMBER"], out:["NUMBER"]}], 
        { in: ['A', ['*']], out: [{ type: ['*'], use: 'play' }, 'A'] }
    ]
]