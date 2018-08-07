#pragma compile(Console, True)
#RequireAdmin;

#include <Array.au3>

Local $list[0] = []
$aList = WinList()
For $i = 1 To $aList[0][0]
  If $aList[$i][0] <> "" And BitAND(WinGetState($aList[$i][1]), 2) Then
    _ArrayAdd($list, $aList[$i][0] & "[~_~]" & $aList[$i][1] & "|[~_~]")
  EndIf
Next

_ArrayAdd($list, "")

ConsoleWrite(_ArrayToString($list) & @CRLF)
