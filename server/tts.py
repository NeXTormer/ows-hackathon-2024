import speech_recognition as sr
import pyttsx3
import sys

input = " ".join(sys.argv[1:])

engine = pyttsx3.init()

rate = engine.getProperty('rate')
engine.setProperty('rate', 160)

volume = engine.getProperty('volume')
engine.setProperty('volume',1.0)

engine.save_to_file(input, 'speech.mp3')
engine.runAndWait()
engine.stop()