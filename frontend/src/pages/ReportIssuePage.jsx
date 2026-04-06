import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";

export default function ReportIssuePage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    voiceTranscript: "",
    latitude: "",
    longitude: "",
    addressLabel: ""
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [listening, setListening] = useState(false);

  function captureLocation() {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
      },
      () => setError("Unable to fetch location. Please allow browser location access.")
    );
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setError("Voice capture failed. Please try again.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setForm((current) => ({
        ...current,
        voiceTranscript: transcript,
        description: current.description || transcript
      }));
    };

    recognition.start();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) {
        formData.append("image", image);
      }

      await api.createIssue({ token, formData });
      setMessage("Issue submitted successfully.");
      setForm({
        title: "",
        description: "",
        voiceTranscript: "",
        latitude: "",
        longitude: "",
        addressLabel: ""
      });
      setImage(null);
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-bold text-slate-900">Report a civic issue</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add a description, upload a photo, and capture your current location so the complaint is easier to route.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Issue title</span>
              <input
                value={form.title}
                onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
                placeholder="Broken streetlight near bus stop"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Image upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              placeholder="Describe what the issue is, where it is, and how serious it feels."
            />
          </label>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Voice-assisted input</h2>
                <p className="text-sm text-slate-500">Use browser speech recognition to capture a quick spoken complaint.</p>
              </div>
              <button
                type="button"
                onClick={startVoiceInput}
                className="rounded-full border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-600"
              >
                {listening ? "Listening..." : "Start voice input"}
              </button>
            </div>
            <textarea
              rows={3}
              value={form.voiceTranscript}
              onChange={(e) => setForm((current) => ({ ...current, voiceTranscript: e.target.value }))}
              className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              placeholder="Voice transcript appears here"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Latitude</span>
              <input
                required
                value={form.latitude}
                onChange={(e) => setForm((current) => ({ ...current, latitude: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Longitude</span>
              <input
                required
                value={form.longitude}
                onChange={(e) => setForm((current) => ({ ...current, longitude: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={captureLocation}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
              >
                Use current location
              </button>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Landmark or address label</span>
            <input
              value={form.addressLabel}
              onChange={(e) => setForm((current) => ({ ...current, addressLabel: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-brand-500"
              placeholder="Near central library"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}
