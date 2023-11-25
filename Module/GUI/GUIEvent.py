##################################################
# モジュールを読み込み
##################################################
import PySimpleGUI as sg


##################################################
# 自作モジュールを読み込み
##################################################
from .GUIData import GUIData


class GUIEvent:
    _guiData: GUIData

    def __init__(self, data: GUIData) -> None:
        self._guiData = data
        pass

    def run(self) -> None:
        """イベント処理"""

        # bootupボタン押下時処理
        self.__bootup()

        return

    def __bootup(self) -> None:
        """bootupボタン押下時処理"""

        # bootup要素のイベントではないなら処理終了
        if not self._guiData.isElemEventActivation("bootup"):
            return

        sg.popup("bootup")

        return
