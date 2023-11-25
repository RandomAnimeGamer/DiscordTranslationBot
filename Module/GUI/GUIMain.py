##################################################
# モジュールを読み込み
##################################################
import PySimpleGUI as sg


##################################################
# 自作モジュールを読み込み
##################################################
from .GUIData import GUIData
from .GUIEvent import GUIEvent
from .GUILayout import Layout


class GUIMain:
    """GUIのメイン処理"""

    _guiData: GUIData
    _guiEvent: GUIEvent

    def __init__(self) -> None:
        self._guiData = GUIData()
        self._guiEvent = GUIEvent(self._guiData)
        pass

    def Start(self) -> None:
        """GUI処理を開始する"""

        # ウィンドウを作成
        self._guiData.setWindowData(sg.Window("Discord Bot", layout=Layout.getLayout()))

        # ループ処理開始
        self.loop()
        return

    def loop(self) -> None:
        """ループ処理"""
        self._guiData.windowRead()

        event: str = self._guiData.getEvent()

        # ウィンドウが閉じられたら終了
        if event == sg.WINDOW_CLOSED:
            return

        # GUIイベント処理
        self._guiEvent.run()

        # ループ
        self.loop()

        # ループ終了時にウィンドウを閉じる
        self._guiData.closeWindow()
        return
