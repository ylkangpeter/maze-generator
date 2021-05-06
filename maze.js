var startRow, startCol, endRow, endCol;
var visited = {}
var counter = 0;

function getCell(row, col)
{
    return $('#mytable tr:eq(' + row + ') td:eq(' + col + ')')
}

function breakWall(cell, wall)
{
    cell.css("border-" + wall, "none")
}

function genPoint(size)
{
    var border = Math.floor(Math.random() * 4);
    var inx = Math.floor(Math.random() * size);

    switch (border)
    {
    case 0:
        return [0, inx]
    case 1:
        return [inx, size - 1]
    case 2:
        return [size - 1, inx]
    default:
        return [inx, 0]
    }
}

function setEntrance(size, classTyp)
{
    var points = genPoint(size);
    startRow = points[0];
    startCol = points[1];
    $('#mytable tr:eq(' + startRow + ') td:eq(' + startCol + ')').addClass("entrance")
}

function setExit(size)
{
    while (true)
    {
        var points = genPoint(size);
        endRow = points[0];
        endCol = points[1];
        if (endRow != startRow && endCol != startCol)
        {
            $('#mytable tr:eq(' + endRow + ') td:eq(' + endCol + ')').addClass("exit")
            break;
        }
    }

}

$(function ()
{
    $("#button").click(function ()
    {
        var size = $('#mazeSize').val()
            if (size == "")
            {
                size = 10; // by default
            }
            var table = $('<table id="mytable" cellspacing=0 cellpadding=0 ></table>').addClass('tClass');
        for (var i = 0; i < size; i++)
        {
            row = $('<tr></tr>');
            for (var j = 0; j < size; j++)
            {
                var rowData = $('<td></td>');
                row.append(rowData);
            }
            table.append(row);
        }

        // if ($('table').length) {
        //      $("#maze tr:first").after(row);
        // }
        // else {
        $('#maze').empty()
        $('#maze').append(table);
        // }
        $("td").mousedown(function ()
        {
            $(this).css("background-color", "red")
            // breakWall($(this), "right")
            // breakWall($(this), "left")
            // breakWall($(this), "top")
            // breakWall($(this), "bottom")
        }
        );

        setEntrance(size)
        setExit(size)

        // init visited map
        for (var i = 0; i < size; i++)
        {
            visited[i] = {}
        }
        counter = 0;
        generate(size)
    }
    );
}
);

async function generate(size)
{
    var stack = new Stack();
    stack.push([startRow, startCol]);
    visited[startRow][startCol] = 1;
    while (!stack.isEmpty())
    {
        var ele = stack.peek();
        var neighbour = getNeighbour(ele, size);
        if (neighbour)
        {
            visited[neighbour[0]][neighbour[1]] = 1;
            stack.push(neighbour);
            // break current cell wall
            breakWall($('#mytable tr:eq(' + ele[0] + ') td:eq(' + ele[1] + ')'), neighbour[2])
            // break neighbour cell wall
            breakWall($('#mytable tr:eq(' + neighbour[0] + ') td:eq(' + neighbour[1] + ')'), neighbour[3])

            counter++;
            // color bg
            // $('#mytable tr:eq(' + ele[0] + ') td:eq(' + ele[1] + ')').text(counter++)
            await sleep(10)
        }
        else
        {
            stack.pop()
        }
    }
    console.log(counter)
    console.log("===end===")
}

function left(ele, size)
{
    if (ele[1] > 0)
    {
        if (!visited[ele[0]][ele[1] - 1])
        {
            return [ele[0], ele[1] - 1, "left", "right"]
        }

    }
}

// row,col, curcellwall, neighbourcellwall
function up(ele, size)
{
    if (ele[0] > 0)
    {
        if (!visited[ele[0] - 1][ele[1]])
        {
            return [ele[0] - 1, ele[1], "top", "bottom"]
        }

    }
}

function bottom(ele, size)
{
    if (ele[0] < size - 1)
    {
        if (!visited[ele[0] + 1][ele[1]])
        {
            return [ele[0] + 1, ele[1], "bottom", "top"]
        }

    }
}

function right(ele, size)
{
    if (ele[1] < size - 1)
    {
        if (!visited[ele[0]][ele[1] + 1])
        {
            return [ele[0], ele[1] + 1, "right", "left"]
        }

    }
}

function shuffle(arr)
{
    let i = arr.length;
    while (i)
    {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
}

function getNeighbour(ele, size)
{
    var permutation = [up, left, right, bottom];
    shuffle(permutation);
    arr = $.map(permutation, function (v)
        {
            return v.name;
        }
        );
    console.log(arr.join("_"));
    for (var i = 0; i < permutation.length; i++)
    {
        var neighbour = permutation[i](ele, size);
        if (neighbour)
        {
            return neighbour;
        }
    }
    return undefined
}

function solve()  {}

function Stack()
{
    let items = [];

    // 入栈
    this.push = function (ele)
    {
        items.push(ele);
    };

    // 出栈
    this.pop = function ()
    {
        return items.pop();
    };

    // 读栈顶
    this.peek = function ()
    {
        if (items.length)
        {
            return items[items.length - 1];
        }
        else
        {
            return false;
        }
    };

    // 判空
    this.isEmpty = function ()
    {
        return items.length === 0;
    };

    // 读栈长度
    this.size = function ()
    {
        return items.length;
    };

    // 清空栈
    this.clear = function ()
    {
        items = [];
    };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}