##################################################
# モジュールを読み込み
##################################################
import PySimpleGUI as sg


##################################################
# 自作モジュールを読み込み
##################################################
from .GUIData import GUIData
from .GUILayout import Layout


class GUIMain:
    """GUIのメイン処理"""

    _guiData: GUIData

    def __init__(self) -> None:
        self._guiData = GUIData()
        pass

    def Start(self) -> None:
        """GUI処理を開始する"""
        self._guiData.setWindowData(sg.Window("Discord Bot", layout=Layout.getLayout()))

        self.loop()
        return

    def loop(self) -> None:
        """ループ処理"""
        self._guiData.windowRead()

        event: str = self._guiData.getEvent()

        # ウィンドウが閉じられたら終了
        if event == sg.WINDOW_CLOSED:
            return

        # ループ
        self.loop()

        self._guiData.closeWindow()
        return
