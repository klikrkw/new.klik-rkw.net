<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Cetak Qr Code</title>
</head>
<style>
    @page {
        margin-left: 0mm;
        margin-top: 5.5mm;
        margin-right: 0mm;
    }

    body {
        /* box-sizing: border-box; */
        padding: 0px;
        font-family: Arial, Helvetica, sans-serif;
        margin: 1mm;
    }

    .container {
        padding-left: 1.5px;
        padding-right: 1px;
        padding-top: 0.5px;
        padding-bottom: 1px;
        font-size: 12px;
    }


    .grid-item {
        display: inline-block;
        width: 38mm;
        height: 25mm;
        margin-left: 0.5mm;
        margin-top: 0.5mm;
        margin-bottom: 1mm;
        padding-top: 1.5mm;
        text-align: center;
        /* border: 1px solid; */
    }
</style>

<body>
    {{-- <div class="container">
        <img src="{{ $qrcode }}" width="100" height="100" />

    </div> --}}
    <div>
        @for ($i = 1; $i <= $row_count; $i++)
            @for ($j = 1; $j <= $col_count; $j++)
                @if ($j == $col && $i == $row)
                    <span class="grid-item"><img src="{{ $qrcode }}" width="70" height="70" /></span>
                @endif
                <span class="grid-item"></span>
            @endfor
        @endfor
    </div>
</body>

</html>
